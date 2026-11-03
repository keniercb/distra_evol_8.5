<?php

class GestorganosatisfaceController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    function init()
    {
        parent::init();
    }

    public function gestorganosatisfaceAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
       // $this->view->jsayuda = $jsayuda;

        $this->render();
    }

    public function cargarorganosatisfacesAction()
    {
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
            }
        }

        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $idpadre = ($this->_request->getPost('idpadre')) ?
            $idpadre = $this->_request->getPost('idpadre')
            : $idpadre = $this->_request->getPost('anode');
        $idarbol = $this->_request->getPost('idarbol');
        if ($this->_request->getPost('anode')) {
            $parametros = array();
        }
        $response = NomOrganosatisface::listarOS(
            $parametros, $start, $limit, $idpadre, $idarbol
        );
        $total = NomOrganosatisface::total($parametros, $idpadre, $idarbol);
        echo json_encode(array('data' => $response, 'total' => $total));
    }

    public function cargardatosorganosatisfaceAction()
    {
        $idorganosatisface = $this->_request->getParam('idselected');
        $response = NomOrganosatisface::ObtenerOACEporId($idorganosatisface);
        echo json_encode($response);
    }

    public function insertarOSAction()
    {
        $idorganosatisface = $this->_request->getParam('idorganosatisface');
        $denominacion = $this->_request->getParam('denominacion');
        $descripcion = $this->_request->getParam('descripcion');
        $color = $this->_request->getParam('color');
        $accion = $this->_request->getParam('accion');
        $idarbol = $this->_request->getPost('idarbol');
        //$idpadre = ($this->_request->getParam('idpadre'))
          //  ? $this->_request->getParam('idpadre') : null;
        $nivelarbol = $this->_request->getParam('nivelarbol');

        $OACE = new NomOrganosatisface();
        if ($idorganosatisface && $accion == 'mod') {
            $OACE = Doctrine::getTable('NomOrganosatisface')->find(
                $idorganosatisface
            );
            if (!empty($OACE)) {

                $OACE->color = $color;
                $OACE->denominacion = $denominacion;
                $OACE->descripcion = $descripcion;
                $idorganosatisface
                    = NomOrganosatisfaceModel::insertarnom_organosatisface(
                        $OACE
                    );
            } else {
                $idorganosatisface = -1;
            }
        } else {
            if ($accion == 'add') {
                $luzverde = NomOrganosatisface::obtenerPordenom($denominacion);
                if (empty($luzverde[0])) {
                    $OACE->color = $color;
                    $OACE->denominacion = $denominacion;
                    $OACE->descripcion = $descripcion;
                    if ($idarbol) {
                        $OACE->idarbol = $idarbol;
                    }
                    $OACE->nivelarbol = $nivelarbol
                        + 1; //esto es hasta que se defina correctamente los nhiveles de profundidad del arbol
                    $OACE->uriorganosatisface = strtolower(
                        str_replace(' ', '', $denominacion)
                    );
                    if ($idorganosatisface != null) {
                        $OACE->idpadre = $idorganosatisface;
                    }
                    $idorganosatisface
                        = NomOrganosatisfaceModel::insertarnom_organosatisface(
                            $OACE
                        );
                } else {
                    $idorganosatisface = -1;
                }
            }
        }
        echo json_encode(array('cod' => $idorganosatisface));
    }

    function eliminarOSAction()
    {
        $idsorganosatisfaces = $this->_request->getParam('idorganosatisface');
        $res = NomOrganosatisfaceModel::eliminarOrganosatisfaces(
            $idsorganosatisfaces
        );
        echo json_encode(array('cod' => $res));
    }

}