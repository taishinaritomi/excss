use swc_core::ecma::ast;
use swc_core::ecma::visit::{VisitMut, VisitMutWith};

pub struct SearchImportVisitor<'a> {
    pub target_css_ident_ids: Vec<ast::Id>,
    pub target_file_hash_ident_ids: Vec<ast::Id>,
    pub target_namespace_ids: Vec<ast::Id>,
    import_source: &'a String,
    import_css_ident: &'a String,
    import_file_hash_ident: &'a String,
}

impl<'a> SearchImportVisitor<'a> {
    pub fn new(
        import_source: &'a String,
        import_css_ident: &'a String,
        import_file_hash_ident: &'a String,
    ) -> Self {
        Self {
            target_css_ident_ids: vec![],
            target_file_hash_ident_ids: vec![],
            target_namespace_ids: vec![],
            import_source,
            import_css_ident,
            import_file_hash_ident,
        }
    }
}

impl VisitMut for SearchImportVisitor<'_> {
    fn visit_mut_import_decl(&mut self, import_decl: &mut ast::ImportDecl) {
        let import_src = import_decl.src.value.to_string();
        // import * from "target"
        if *self.import_source == import_src {
            for specifier in import_decl.specifiers.iter() {
                match specifier {
                    // import { css, css as _css } from 'target'
                    ast::ImportSpecifier::Named(import_named) => {
                        let import_ident: Option<&ast::Ident> = match &import_named.imported {
                            Some(import_named_imported) => {
                                match import_named_imported {
                                    // import { css as _css } from 'target'
                                    ast::ModuleExportName::Ident(imported_ident) => {
                                        Some(imported_ident)
                                    }
                                    // import { "css" as css } from 'target'
                                    ast::ModuleExportName::Str(_) => None,
                                }
                            }
                            // import { css } from 'target'
                            None => Some(&import_named.local),
                        };

                        if let Some(import_ident) = import_ident {
                            let ident_sym = import_ident.sym.to_string();

                            if *self.import_css_ident == ident_sym {
                                self.target_css_ident_ids.push(import_named.local.to_id());
                            } else if *self.import_file_hash_ident == ident_sym {
                                self.target_file_hash_ident_ids
                                    .push(import_named.local.to_id());
                            }
                        }
                    }
                    // import * as namespace from 'excss'
                    ast::ImportSpecifier::Namespace(namespace) => {
                        self.target_namespace_ids.push(namespace.local.to_id());
                    }
                    // import default from 'excss'
                    ast::ImportSpecifier::Default(_) => {}
                };
            }
        }
        import_decl.visit_mut_children_with(self);
    }
}
