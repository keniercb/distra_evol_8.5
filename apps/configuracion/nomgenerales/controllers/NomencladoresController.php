<?php
class NomencladoresController extends ZendExt_Controller_Secure
{
    function init()
    {
        $registro = Zend_Registry::getInstance();
        //if($registro->session->modelo)
        //$obj= new $this->_request->get('nomid')."Model";
        $this->model = new NomencladoresModel();
        // echo ($this->_request->get('nomid'));
        parent::init();
    }

    function gestionarnomencladoresAction()
    {
        $this->view->nomjs = "gestionar" . strtolower($this->_request->get('nomid'));
        $this->render();
    }

    function cargarAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        //$elementos = array('cant'=>$this->nomencladores[$this->_request->getPost('nomid')]->Count(),'datos'=>$this->nomencladores[$this->_request->getPost('nomid')]->Data());
        $valores = $this->_request->getPost();
        $class = $this->_request->getPost('nomid');
        $nomenclador = Doctrine::getTable($class);
        $nombcamps = $nomenclador->getColumnNames();

        $filt = null;
        foreach ($nombcamps as $cp) {
            if ($valores[$cp]) {
                $filt[$cp] = $valores[$cp];
            }
        }
        $objent = new $class;
        $elementos = $objent->buscar($filt, $limit, $start);
        echo(json_encode($elementos));
    }

    function cargarselectAction()
    {
        $nomenclador = $this->getRequest()->getParams();
        $elementos = array('cant'  => $this->nomencladores[$nomenclador['nomenclador']]->Count(),
                           'datos' => $this->nomencladores[$nomenclador['nomenclador']]->Data());
        echo(json_encode($elementos));
    }

    function eliminarAction()
    {
        $metodo = $this->Metodo("eliminar");
        $class = $this->_request->getPost('nomid');
        $nomenclador = new $class;
        $valores = $this->_request->getPost();
        unset($valores['nomid']);
        $nomenclador = Doctrine::getTable($class);
        $nombllav = $nomenclador->getIdentifierColumnNames();

        try {
            if (strpos($valores[$nombllav[0]], ',')) {
                $elementos = split(",", $valores[$nombllav[0]]);

                foreach ($elementos as $i => $elem) {
                    if (count($nombllav) == 1) {
                        $nomenclador = Doctrine::getTable($class)->find($elem);
                    } else {
                        $j = 0;
                        $elk = split("-", $elem);
                        $keyval = array();
                        foreach ($elk as $i => $val) {
                            if ($nombllav[$j++] == $i) {
                                $keyval[] = $val;
                            }
                        }
                        if ($keyval) {
                            $nomenclador = Doctrine::getTable($class)->find((array)$keyval);
                        }
                    }
                    $this->model->$metodo($nomenclador);
                    unset($nomenclador);
                }
                $this->showMessage('Los elementos fueron eliminados satisfactoriamente.');
            } else {
                if (count($nombllav) == 1) {
                    $nomenclador = Doctrine::getTable($class)->find($valores[$nombllav[0]]);
                } else {
                    $j = 0;
                    $keyval = array();
                    $elk = split("-", $valores[$nombllav[0]]);
                    foreach ($elk as $i => $val) {
                        if ($nombllav[$j++] == $i) {
                            $keyval[] = $val;
                        }
                    }
                    if ($keyval) {
                        $nomenclador = Doctrine::getTable($class)->find((array)$keyval);
                    }
                }

                if ($this->model->$metodo($nomenclador)) {
                    $this->showMessage('El elemento fue eliminado satisfactoriamente.');
                } else {
                    throw new ZendExt_Exception('CONF' . $this->_request->getPost('nomid') . 'E');
                }
                //echo("{'codMsg':3,'mensaje': 'Error al tratar de eliminar.'}");
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF002', $ee);
        }

    }

    function insertarAction()
    {
        try {
            $metodo = $this->Metodo("insertar");
            $class = $this->_request->getPost('nomid');
            $nomenclador = new $class;

            foreach ($this->_request->getPost() as $i => $atributo) {
                if ($i != 'nomid') {
                    $nomenclador->$i = $this->_request->getPost($i);
                }
            }
            if ($this->model->$metodo($nomenclador)) {
                $this->showMessage('El elemento fue insertado satisfactoriamente.');
            } else {
                echo("{'codMsg':3,'mensaje': 'El elemento a insertar ya existe.'}");
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF001', $ee);
        }
    }

    /*-------------------------------------------------------------*/
    function verifdateAction()
    {
        $class = $this->_request->getPost('nomid');
        $nomenclador = new $class;
        $nomenclador = Doctrine::getTable($class);
        $nombllav = $nomenclador->getIdentifierColumnNames();
        $nombcamps = $nomenclador->getColumnNames();
        $cond = array();

        foreach ($nombllav as $vl) {
            $cond[$vl] = $this->_request->getPost($vl);
        }
        $objejec = new $class;
        $arrvalues = $objejec->buscar($cond);
        //print_r($nombcamps);die;
        //echo();
        $i = 0;
        foreach ($nombcamps as $nc) {
            if ($this->_request->getPost($nc)) {
                if ($arrvalues['datos'][0][$nc] != $this->_request->getPost($nc)) {
                    echo("{'retorno': '0'}");

                    return;
                }
            }
        }
        echo("{'retorno': '1'}");

    }

    /*----------------------------------------------------------------*/

    function modificarAction()
    {
        try {
            $metodo = $this->Metodo("modificar");
            $class = $this->_request->getPost('nomid');
            $nomenclador = new $class;
            $valores = $this->_request->getPost();
            unset($valores['nomid']);
            $nomenclador = Doctrine::getTable($class);
            $nombllav = $nomenclador->getIdentifierColumnNames();
            if (count($nombllav) == 1) {
                $nomenclador = Doctrine::getTable($class)->find($valores[$nombllav[0]]);
            } else {
                $j = 0;
                $keyval = array();
                foreach ($valores as $i => $val) {
                    if ($nombllav[$j++] == $i) {
                        $keyval[] = $val;
                    }
                }
                if ($keyval) {
                    $nomenclador = Doctrine::getTable($class)->find((array)$keyval);
                }
            }
            foreach ($valores as $i => $atributo) {
                $nomenclador->$i = $valores[$i];
            }
            if ($this->model->$metodo($nomenclador)) {
                $this->showMessage('El elemento fue modificado satisfactoriamente.');
            } else {
                echo("{'codMsg':3,'mensaje': 'El elemento a modificar ya existe.'}");
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF003', $ee);
        }
    }

    public function Metodo($nombreti)
    {
        $registro = Zend_Registry::getInstance();

        return $nombreti . substr($registro->session->nom, 0, strpos($this->_request->get('nomid'), "Model"));
    }
}
?>
