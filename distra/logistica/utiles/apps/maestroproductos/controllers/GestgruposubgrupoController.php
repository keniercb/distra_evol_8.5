<?php

/**
 * Controlador del Nomenclador de Grupos y subgrupos
 *
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
class GestgruposubgrupoController extends BaseController
{
    private $grupo, $grupoModel, $subgrupo, $subgrupoModel, $idestructura, $hojaArbol, $longitudformato, $arrFormato;

    public function init()
    {
        parent::init();
        $this->grupo = new NomGruposubgrupo();
        $this->grupoModel = new NomGruposubgrupoModel();
        $this->subgrupo = new NomGruposubgrupohoja();
        $this->subgrupoModel = new NomGruposubgrupohojaModel();
        $this->idestructura = $this->global->Estructura->idestructura;
    }

    public function gestgruposubgrupoAction()
    {
        $this->autoShow = false;

        $this->view->estructura='var v_estructura ='. $this->idestructura;
        $this->render();
    }

    public function obtenernivelhoja($idformato)
    {
        $formatos = $this->configuracionHelper->buscarFormato();
        $cantidad = 0;
        foreach ($formatos as &$formato) {
            $partes = $this->configuracionHelper->BuscarParteFormato($formato->idformato);
            if ($idformato == $formato->idformato) {
                foreach ($partes as $key => $parte) {
                    $formato->partes[$key]->nivel = $key;
                    $formato->partes[$key]->longitud = $parte->longitud;
                    $cantidad++;
                }
                break;
            }
        }

        return $cantidad;
    }

    public function obtenerpartesformatoAction()
    {
        $this->objectHelper->synchronize(
            $this, array('longitudformato' => $this->longitudformato, 'data' => $this->arrFormato)
        );
    }

    /**
     * Cargar el arbol de grupo
     * */
    // copia del metodo para utilizar la clase treeSearch
    public function getarbolgrupo()
    {
        $this->autoShow = false;
        $objParams = new stdClass();
        $objParams->idnodo = $this->_request->getPost('node');
        $objParams->nivel = $this->_request->getPost('nivel');
        $objParams->denominacion = $this->_request->getPost('denominacion');
        $objParams->idestructuracomun = $this->idestructura;
        $objParams->hoja = $this->hojaArbol;

        if ($objParams->nivel == 'undefined') {
            $objParams->nivel = 1;
        }
        $objParams->incluirvencidos = 2;
        $datos = $this->grupo->getArbol($objParams);
        foreach ($datos as &$dato) {
            $nivelhoja = $this->obtenernivelhoja($dato['idformato']);
            if ($nivelhoja == 1) {
                $dato['leaf'] = true;
            } else {
                if ($dato['nivel'] == ($nivelhoja - 1)) {
                    $dato['leaf'] = true;
                }
            }
        }

        echo json_encode($datos);
    }

    public function gettreegrupoAction()
    {
        $this->autoShow = false;
        $objParams = new stdClass();
        $objParams->idnodo = $this->_request->getPost('node');
        $objParams->nivel = $this->_request->getPost('nivel');
        $objParams->denominacion = $this->_request->getPost('denominacion');
        $objParams->query = $this->_request->getPost('denominacion');
        $objParams->idestructuracomun = $this->idestructura;
        $objParams->formatLength = 20; // $this->_request->getPost('formatLength ');

        if ($objParams->idnodo && $objParams->denominacion) {
            $objParams->denominacion = "";
            $objParams->query = "";
        }
        if ($objParams->nivel == 'undefined') {
            $objParams->nivel = 1;
        }
        if ($objParams->query == '') {
            $this->getarbolgrupo();
        } else {
            $datos = $this->grupoModel->buscarTree($objParams);
            if ($datos != "null") {
                echo $datos;
            }
        }
    }

    /**
     * Insertar grupos (arbol)
     * */
    public function insertargrupoAction()
    {
        try {
            $this->grupoModel->insertar($this->uiParams);
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            $this->cod = 3;
            if ($e->getCode() == '23505') {
                $this->msg = 'duplicado';
            }
        }
    }

    /**
     * Modificar un grupo (arbol)
     * */
    public function modificargrupoAction()
    {
        try {
            $this->grupoModel->actualizar($this->uiParams);
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            $this->cod = 3;
            if ($e->getCode() == '23505') {
                $this->msg = 'duplicado';
            }
        }
    }

    /**
     * Eliminar un grupo (arbol)
     * */
    public function eliminargrupoAction()
    {
        try {
            $this->grupoModel->eliminar($this->uiParams['idgrupo']);
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '23503') {
                $this->cod = 2;
            } else {
                $this->cod = 3;
            }
        }
    }

    /**
     * Cargar subgrupos (hojas del arbol de grupos)
     * */
    function cargarsubgruposAction()
    {
        $objParams = $this->objectHelper->getStdClassFromArray($this->uiParams);
        $this->setDefaultParam('limit', 20);
        $objParams->incluirvencidos = 2;
        $total = $this->subgrupo->getCantDatos($objParams);
        $datos = $this->subgrupo->getDatos($objParams /* , $this->arrFormato[$this->hojaArbol]['longitud'] */);
        $this->objectHelper->synchronize($this, array('total' => $total, 'datos' => $datos));
    }

    /**
     * Insertar subgrupo (hoja)
     * */
    function insertarsubgrupoAction()
    {
        try {
            $this->subgrupoModel->insertar($this->uiParams);
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            $this->cod = 3;
            if ($e->getCode() == '23505') {
                $this->msg = 'duplicado';
            }
        }
    }

    /**
     * Modificar subgrupo (hoja)
     * */
    public function modificarsubgrupoAction()
    {
        try {
            $parametros = $this->_request->getPost();
            $this->subgrupoModel->actualizar($parametros);
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            $this->cod = 3;
            if ($e->getCode() == '23505') {
                $this->msg = 'duplicado';
            }
        }
    }

    /**
     * Eliminar subgrupo (hoja)
     * */
    public function eliminarsubgrupoAction()
    {
        try {
            $arrGrupos = json_decode($this->_request->getPost('idgrupo'));
            $this->subgrupoModel->eliminar($arrGrupos);
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            $this->cod = 3;
            if ($e->getCode() == '23505') {
                $this->msg = 'duplicado';
            }
        }
    }

    public function getFormatosAction()
    {
        $formatos = $this->configuracionHelper->buscarFormato();
        foreach ($formatos as &$formato) {
            $partes = $this->configuracionHelper->BuscarParteFormato($formato->idformato);
            foreach ($partes as $key => $parte) {
                $formato->partes[$key]->nivel = $key;
                $formato->partes[$key]->longitud = $parte->longitud;
            }
        }
        $this->hojaArbol = count($this->arrFormato) - 1;
        $this->datos = $formatos;
    }

}
