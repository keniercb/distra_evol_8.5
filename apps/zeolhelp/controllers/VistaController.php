<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of VistaController
 *
 * @author jose
 */
class VistaController extends ZendExt_Controller_Secure
{
    private $_document;
    private $_proyecto;

    function init()
    {
        parent::init();
        $this->_document = new DOMDocument();
        $this->_proyecto = new ManejadorProyectoModel($this->_document);
    }

    public function listProjectAction()
    {
        $tmpProjects = $this->_proyecto->listarProjecto();
        echo json_encode($tmpProjects);
    }

    public function vistaAction()
    {
        $this->render();
    }
}