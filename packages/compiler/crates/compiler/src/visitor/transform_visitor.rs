use std::collections::HashSet;

use itertools::Itertools;
use swc_core::{
    common::errors,
    ecma::{
        ast,
        visit::{VisitMut, VisitMutWith},
    },
};

use crate::{compiler::compile_css, visitor::search_import_visitor::SearchImportVisitor};

pub struct TransformVisitor<'a> {
    target_css_ident_ids: Vec<ast::Id>,
    target_file_id_ident_ids: Vec<ast::Id>,
    target_namespace_ids: Vec<ast::Id>,
    import_source: &'a String,
    import_css_ident: &'a String,
    import_file_id_ident: &'a String,
    css_list: HashSet<String>,
    helper_css: &'a String,
    file_id: &'a String,
    hash_count: usize,
}

impl<'a> TransformVisitor<'a> {
    pub fn new(
        import_source: &'a String,
        import_css_ident: &'a String,
        import_file_id_ident: &'a String,
        file_id: &'a String,
        helper_css: &'a String,
    ) -> Self {
        TransformVisitor {
            import_source,
            import_css_ident,
            import_file_id_ident,
            file_id,
            helper_css,
            target_css_ident_ids: vec![],
            target_file_id_ident_ids: vec![],
            target_namespace_ids: vec![],
            css_list: HashSet::new(),
            hash_count: 0,
        }
    }

    pub fn get_css(&self) -> String {
        self.css_list.iter().join("")
    }
}

impl VisitMut for TransformVisitor<'_> {
    fn visit_mut_expr(&mut self, expr: &mut ast::Expr) {
        match expr {
            ast::Expr::Ident(ident) => {
                for target_id in self.target_file_id_ident_ids.iter() {
                    if ident.to_id() == *target_id {
                        *expr = ast::Expr::Lit(ast::Lit::Str(ast::Str {
                            raw: None,
                            span: ident.span,
                            value: self.file_id.clone().into(),
                        }));
                        break;
                    }
                }
            }
            ast::Expr::Member(member) => {
                for target_namespace_id in self.target_namespace_ids.iter() {
                    if let ast::Expr::Ident(ident) = &*member.obj {
                        if ident.to_id() == *target_namespace_id {
                            if let ast::MemberProp::Ident(ident) = &member.prop {
                                let ident_sym = ident.sym.to_string();
                                if *self.import_file_id_ident == ident_sym {
                                    *expr = ast::Expr::Lit(ast::Lit::Str(ast::Str {
                                        raw: None,
                                        span: member.span,
                                        value: self.file_id.clone().into(),
                                    }));
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            ast::Expr::TaggedTpl(tagged_tpl) => {
                let mut is_target_css_ident = false;
                match &*tagged_tpl.tag {
                    // fn``
                    ast::Expr::Ident(ident) => {
                        for target_id in self.target_css_ident_ids.iter() {
                            if ident.to_id() == *target_id {
                                is_target_css_ident = true;
                            }
                        }
                    }
                    // namespace.fn``
                    ast::Expr::Member(member) => {
                        for target_namespace_id in self.target_namespace_ids.iter() {
                            if let ast::Expr::Ident(ident) = &*member.obj {
                                if ident.to_id() == *target_namespace_id {
                                    if let ast::MemberProp::Ident(ident) = &member.prop {
                                        let ident_sym = ident.sym.to_string();
                                        if *self.import_css_ident == ident_sym {
                                            is_target_css_ident = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _ => {}
                }

                if is_target_css_ident {
                    let css = tagged_tpl
                        .tpl
                        .quasis
                        .iter()
                        .map(|quasi| quasi.raw.to_string())
                        .collect::<Vec<_>>()
                        .join("");

                    let mut class_name = "".to_string();

                    if !css.is_empty() {
                        let hash_salt = format!("{}+{}", &self.file_id, &self.hash_count);
                        self.hash_count += 1;

                        match compile_css::compile(css, self.helper_css.clone(), hash_salt) {
                            Ok(output) => {
                                class_name = output.class_name;
                                self.css_list.insert(output.css);
                            }
                            Err(err) => {
                                errors::HANDLER.with(|h| h.err(&err.to_string()));
                            }
                        }
                    }

                    *expr = ast::Expr::Lit(ast::Lit::Str(ast::Str {
                        raw: None,
                        span: tagged_tpl.span,
                        value: class_name.into(),
                    }));
                }
            }
            _ => {}
        };
        expr.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, module: &mut ast::Module) {
        let mut search_import_visitor = SearchImportVisitor::new(
            self.import_source,
            self.import_css_ident,
            self.import_file_id_ident,
        );

        module.visit_mut_with(&mut search_import_visitor);

        self.target_css_ident_ids = search_import_visitor.target_css_ident_ids;
        self.target_file_id_ident_ids = search_import_visitor.target_file_id_ident_ids;
        self.target_namespace_ids = search_import_visitor.target_namespace_ids;

        module.visit_mut_children_with(self);
    }
}
