<?php

class GestcolumnasController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function gestcolumnasAction() {
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function validarOperacionesAction() {
        $idcolumna = $this->_request->getPost('idcolumna');
        $operacion = $this->_request->getPost('operacion');
        $denomColumna = NomColumna::buscarDenominacion($idcolumna);
        $enuso = NomColumna::verEnUso($idcolumna);

        if ($denomColumna[0][denominacion] == 'Importe' || $denomColumna[0][denominacion] == 'Cantidad') {
            if ($operacion == 'del' || $operacion == 'mod') {
                echo("{'codMsg':20 }"); //las columnas son fijas, no se puede realizar la operacion
            } else {
                echo("{'codMsg':22 }");
            } //se puede realizar la operacion
        } else {
            if ($operacion == 'del' && $enuso[0] != null) {
                echo("{'codMsg':21 }"); //las columnas estan en uso, no se puede realizar la operacion
            } else {
                echo("{'codMsg':22 }");
            }
        } //se puede realizar la operacion
    }

    public function adicionarColumnaAction() {
        //Definir el objeto columna
        $idcolumna = $this->_request->getPost('idcolumna');
        if ($idcolumna) {
            $denominacion = $this->_request->getPost('iddenominacionmod');
            $existeden = NomColumnaModel::existencia($denominacion, $idcolumna);
        } else {
            $denominacion = $this->_request->getPost('denominacion');
            $existeden = NomColumnaModel::existencia($denominacion, $idcolumna);
        }
        if ($existeden) {
            if ($idcolumna) {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'mod'));
            } else {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'add'));
            }
        } else {
            //Instancear el modelo de columna
            $model = new NomColumnaModel();

            //Si me envian un idcolumna es para modificar
            if ($idcolumna) {
                $col = Doctrine::getTable('NomColumna')->find($idcolumna);
                $mensaje = "mod";
                $denominacion = $this->_request->getPost('iddenominacionmod');
                $descripcion = $this->_request->getPost('iddescripcionmod');
            } else {
                $col = new NomColumna();
                $mensaje = "add";
                $denominacion = $this->_request->getPost('denominacion');
                $descripcion = $this->_request->getPost('descripcion');
            }
            //seteo parámetros
            if ($denominacion) {
                $col->denominacion = $denominacion;
            }
            if ($descripcion) {
                $col->descripcion = $descripcion;
            }
            $model->Insertar($col);

            echo json_encode(array('codMsgP' => 1, 'mensaje' => $mensaje));
        }
    }

    public function listarColumnasAction() {
        //seteo parámetros
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $porfiltro = $this->_request->getPost('filtro');
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        if ($this->_request->getPost('enuso') == '1' || $this->_request->getPost('enuso') == '0'
        ) {
            $parametros ['enuso'] = $this->_request->getPost('enuso');
        }
        $parametros ['denominacion'] = $this->_request->getPost('denominacion');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    } else {
                        if ($datos['field'] == 'enuso') {
                            if ($datos ['data'] ['value'] == 'Si' || $datos ['data'] ['value'] == 'Sí') {
                                $parametros ['enuso'] = 1;
                            } else {
                                $parametros ['enuso'] = 2;
                            }
                        }
                    }
                }
            }
        }
        //Se listan los valores filtrados
        if (!$porfiltro) {
//Obtiene la lista de columnas dado un id padre o nodo
            $data = NomColumna::Listar($parametros, $start, $limit, $idtipomodelo);

            foreach ($data->data as $k => $valor) {
                $enuso = NomColumna::verEnUso($valor['idcolumna']);
                if ($enuso[0] != null) {
                    $data->data[$k]['enuso'] = 1;
                } else {
                    $data->data[$k]['enuso'] = 0;
                }
            }
        } else {
            
        }
        echo json_encode($data);
    }

    public function eliminarColumnaAction() {
        $idcolumna = json_decode(stripslashes($this->_request->getPost('idcolumna')));
        $model = new NomColumnaModel();
        $cont = -1;
        if (!empty($idcolumna)) {
            foreach ($idcolumna as $value) {
                if ($model->eliminarencadena($value)) {
                    $cont++;
                }
            }
        }
        if ($key == $cont) {
            echo("{'codMsgP':1 }");
        } else {
            if ($key != $cont) {
                echo("{'codMsgP':2 }");
            } else {
                if ($cont == -1) {
                    echo("{'codMsgP':4 }");
                } else {
                    echo("{'codMsgP':3 }");
                }
            }
        } //ocurrio error*/
    }

    public function cargarcomboestadosAction() {
        $data->data [] = array('idestado' => 1, 'estado' => 'Si');
        $data->data [] = array('idestado' => 0, 'estado' => 'No');
        echo json_encode($data);
    }

}
