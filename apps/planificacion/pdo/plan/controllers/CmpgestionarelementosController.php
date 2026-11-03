<?php

/**
 * Controlador para gestionar actividades
 *

 */
class CmpgestionarelementosController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarelementos.phtml
     */
    function cmpgestionarelementosAction()
    {
        $this->render();
    }

    /**
     * Accion para cargar elementos de la planificacion
     */
    function cargarelementosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $session = Zend_Registry::get('session');
        //$certificado = $session->certificado;
        $propiedadeselemento['idusuariosession']
            = $this->global->Perfil->idusuario;
        $propiedadeselemento['iddominio'] = $this->global->Perfil->iddominio;
        $propiedadeselemento['idestadoaprobacion'] = $this->_request->getPost(
            'idestadoaprobacion'
        );
        $propiedadeselemento['estaaprobando'] = $this->_request->getPost(
            'estaaprob'
        );
        $propiedadeselemento['busqsimple'] = $this->_request->getPost(
            'busqsimple'
        );
        $propiedadeselemento['limit'] = $this->_request->getPost('limit');
        $propiedadeselemento['offset'] = $this->_request->getPost('offset');
        $propiedadeselemento['operloggeneral'] = $this->_request->getPost(
            'operloggeneral'
        );
        $propiedadeselemento['operlogautinvol'] = $this->_request->getPost(
            'operlogautinvol'
        );
        $propiedadeselemento['tfcar'] = $this->_request->getPost('tfcar');
        $propiedadeselemento['superior'] = $this->_request->getPost('superior');
        $propiedadeselemento['idtipoelemento'] = $this->_request->getPost(
            'idtipoelemento'
        );
        $propiedadeselemento['fechainiciob'] = json_decode(
            stripslashes($this->_request->getPost('fechainicioB'))
        );
        $propiedadeselemento['fechafinb'] = json_decode(
            stripslashes($this->_request->getPost('fechafinB'))
        );
        $propiedadeselemento['denominacionb'] = $this->_request->getPost(
            'denominacionB'
        );
        $propiedadeselemento['arrayautores'] = json_decode(
            stripslashes($this->_request->getPost('arrayautores'))
        );
        $propiedadeselemento['arrayinvolucrados'] = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );

        $objmodelelementos = new GestionarElementosModel();
        $arrayelementos = $objmodelelementos->CargarElementos(
            $propiedadeselemento
        );
        if (isset($arrayelementos[1][0]['idelemento'])) {
            echo json_encode(
                array('total'  => $arrayelementos[0],
                      'campos' => $arrayelementos[1])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Funcion para cargar el combo de estados de aprobacion de los elementos
     */
    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = $this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }


}


