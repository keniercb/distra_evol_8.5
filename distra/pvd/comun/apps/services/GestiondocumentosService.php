<?php

class GestiondocumentosService extends ZendExt_Model {
    private $gestiondocumentosModel;

//    public function __construct()
//    {
//
//    }

    public function ExportarReporteService() {
        parent::ZendExt_Model();
    }

    //podibles valores de $compToLoad
    //1-componente subir documentos, 2 - componente ver espacio de trabajo, 3 - los dos componentes
    public function obtenerScriptsGestionDocumentos($compToLoad)
    {
        $scripts = '';
        if($compToLoad == 1 || $compToLoad == 3)
        {
            $scripts.=  '<link rel="stylesheet" type="text/css" href="/pvd/comun/views/js/gestiondocumentoscomp/dropzone.css" />';
            $scripts.=  '<script type="text/javascript" src="/pvd/comun/views/js/gestiondocumentoscomp/dropzone.js"></script>';
            $scripts.=  '<script type="text/javascript" src="/pvd/comun/views/js/gestiondocumentoscomp/subirdocumentocomp.js"></script>';
        }

        if($compToLoad == 2 || $compToLoad == 3)
        {
            $scripts.=  '<link rel="stylesheet" type="text/css" href="/pvd/comun/views/js/gestiondocumentoscomp/data-view.css" />';
            $scripts.=  '<script type="text/javascript" src="/pvd/comun/views/js/gestiondocumentoscomp/verespaciotrabajocomp.js"></script>';
        }

        return $scripts;
    }

    public function viewDocument($id)
    {
        $gestiondocumentosModel = new GestiondocumentosModel();
        return $gestiondocumentosModel->viewDocument($id);
    }

    public function deleteDocument($arrIds)
    {
        $gestiondocumentosModel = new GestiondocumentosModel();
        return $gestiondocumentosModel->deleteDocument($arrIds);
    }

}