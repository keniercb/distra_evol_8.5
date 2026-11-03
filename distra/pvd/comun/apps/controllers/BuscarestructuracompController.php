<?php

class BuscarestructuracompController extends ZendExt_Controller_Secure {

    private $persona;

    function init() {
        parent::init();
    }

    function buscarestructuracompAction() {
        $this->render();
    }

    function obtenerraizAction() {
        $nivelchequear = json_decode(stripslashes($this->_request->getPost('nivelachequear')));
        $nivel = $this->_request->getPost('nivel');
        $padre = $this->_request->getPost('padre');
        if ($padre == ''){
            $arrEntidad = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
          // print_r($arrEntidad);die;
            $t->id = $this->global->Estructura->idestructura;
            if($arrEntidad[0]->idtipo == 3){
                $t->text = $arrEntidad[0]->codigo .'-'. $arrEntidad[0]->denominacion;
            }else{
                $t->text = $arrEntidad[0]->denominacion;
            }
            $t->tipoestructura = $arrEntidad[0]->idtipo;
            $t->nivel = $this->_request->getPost('nivel');
            $t->idtipo = $arrEntidad[0]->idtipo;
            //$t->idtipo = $arrEntidad[0]->type;
            //$t->tipoestructura = $arrEntidad[0]->idtipo;
            if ($nivelchequear != '') {
                foreach ($nivelchequear as $i => $v) {
                    if ($v == $t->idtipo) {
                        $t->checked = true;
                    }
                }
            }
            if ($t->idtipo == $nivel && $nivel != '') {
                $t->hoja = true;
                $t->leaf = true;
                $t->expandable = 'false';
            } else {
                $t->hoja = false;
                $t->expandable = 'true';
            }
            //print_r($t);die;
			//$t->leaf = false;
            echo json_encode($t);
        }/* Para el caso que se quiera mostrar la estructura completa sin tener en cuenta el dominio */
         else if ($padre == 'ESTRUCTURACOMPLETA') {
            $t->id = 0;
            $t->text = 'Estructuras';
            $t->tipoestructura = 1;
            $t->nivel = $this->_request->getPost('nivel');
            $t->hoja = false;
            $t->expandable = 'true';
            echo json_encode($t);
        } else {
            $arrEntidad = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
            $t->id = $arrEntidad[0]->idestructura;
             if($arrEntidad[0]->idtipo == 3){
                 $t->text = $arrEntidad[0]->codigo .'-'. $arrEntidad[0]->denominacion;
             }else{
                 $t->text = $arrEntidad[0]->denominacion;
             }
            $t->tipoestructura = $arrEntidad[0]->idtipo;
            $t->nivel = $this->_request->getPost('nivel');
            $t->hoja = false;
            $t->expandable = 'true';
            echo json_encode($t);
        }
    }

    private function buscarIcono($arr, $id) {
        foreach ($arr as $i => $v) {
            if ($v['idnomeav'] == $id)
                return $v['icono'];
        }
        return 'No conocido';
    }

    function cargarestructuraAction() {
        //print_r($this->_request->getPost('nivel'));die;
        $idnodo = $this->_request->getPost('node');
        $denominacion = $this->_request->getPost('denominacion');
        $esbuscar = $this->_request->getPost('esbuscar');
        //$tipocargo = $this->_request->getPost('tipocargo');
        $nivelachequear = $this->_request->getPost('nivelachequear');
        /*if ($this->_request->getPost('nivel'))
            $nivel = $this->_request->getPost('nivel');        
        else
            $nivel = -1;*/
        $nivel = -1;
        //Si le paso un padre por parametro entonces busca a partir del padre, sino busca a partir de la estructura por donde se entro al sistema 
        if ($this->_request->getPost('padre')) {
            $idestructura = $this->_request->getPost('padre');
        } else {
            $idestructura = $this->global->Estructura->idestructura;
        }
        $idestructura = ($idnodo == 'idraiz') ? $idestructura : $idnodo;
        if ($esbuscar == '1') {
            //Buscando las entidades que se escribieron en el textfield
            $sqlUM = 'select distinct estr.idestructura from mod_estructuracomp.dat_estructura estr
                                    where estr.codigo ilike ?;';
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrUM = $conn->fetchAll($sqlUM, array($denominacion));
            $idestructura = $arrUM[0]['idestructura'];
            $arbolestructurae = $this->integrator->metadatos->DameEstructura($idestructura);
            $arr[0]['id'] = $idestructura;
            $arr[0]['leaf'] = true;
            $arr[0]['denominacion'] = $arbolestructurae[0]->codigo .'-'. $arbolestructurae[0]->denominacion;
            $arr[0]['text'] = $arbolestructurae[0]->codigo .'-'. $arbolestructurae[0]->denominacion;
            $arr[0]['tipoestructura'] = $arbolestructurae[0]->idtipo;
            $arr[0]['icon'] = $arbolestructurae[0]->icon;
        } else {
            if ($idestructura == 0)
                $idestructura = "O";

            $arbolestructurae = $this->integrator->metadatos->DameHijosEstructura($idestructura);
            //print_r($arbolestructurae);die;
            if (count($arbolestructurae)) {
               // $arriconos = $this->integrator->metadatos->BuscartodosnomencladoresEAV();
                $i = 0;
                $arr = array();                
                foreach ($arbolestructurae as $valores => $valor) {
                    if (($valor->idconcepto == 7) && $nivel == -1)
                        $arr[$i]['leaf'] = true;
                    else if ($valor->idconcepto == $nivel)
                        $arr[$i]['leaf'] = true;
                    else
                        $arr[$i]['leaf'] = false;
                    //aqui chequeamos el nivel que es hoja para permitir la seleccion multiple
                    $rexplodenivch = explode(',', $nivelachequear);
                    if(count($rexplodenivch)>1) {
                            foreach ($rexplodenivch as $nch){
                                if ($valor->idconcepto == $nch) {
                                    $arr[$i]['checked'] = false;
                                }
                            }

                    }else{
                        if ($nivelachequear != -1)
                            if ($valor->idconcepto == $nivelachequear) {
                                $arr[$i]['checked'] = false;
                            }
                    }


                    //$icono = '/metadatos/comun/recursos/iconos/'.$valor->icono.'.gif';
                    //$icono = $valor->icon;
                    //$tipo = $this->buscarIcono($arriconos, $valor->icono);
                    $arr[$i]['id'] = $valor->id;
                    if($valor->idconcepto == 3){
                        $arr[$i]['denominacion'] = $valor->codigo .'-'. $valor->denominacion;
                        $arr[$i]['text'] = $valor->codigo .'-'. $valor->denominacion;
                    }else{
                        $arr[$i]['denominacion'] = $valor->denominacion;
                        $arr[$i]['text'] = $valor->denominacion;
                    }
                   // $arr[$i]['text'] = $valor->text;
                   // $arr[$i]['denominacion'] = $valor->text;
                    $arr[$i]['tipoestructura'] = $valor->idconcepto;
                    //$arr[$i]['leaf'] = true;
                    $arr[$i]['icon'] = $valor->icon;
                    $arr[$i]['qtip'] = '<p>' . $valor->text . '</p>'.'<p><b> Cantidad Real: ' . $valor->cantidad . '</b></p>';
                    $arr[$i]['cant'] = $valor->cantidad;
                    $i++;
                }
            } else {
                $arr = array();
            }
        }
		        //print_r($arr);die;
        echo json_encode($arr);
    }

    /* Funcion que se le pasa la denominacion y busca todas las coincidencias que existen debajo del nodo del arbol que tiene como id el  idestructura pasado como parametro */

    private function buscarEstructuraposDenominacion($denominacion, $idestructura, $nivelachequear) {
        $arbolEstCamino = $this->integrator->metadatos->BuscardatosestructuraPorDenominacionconCamino($denominacion, $idestructura);
        if (count($arbolEstCamino) > 0) {
            $arriconos = $this->integrator->metadatos->BuscartodosnomencladoresEAV();
            $primerosHijos = $this->buscarHijosenArreglonoRepetidos($arbolEstCamino, $idestructura);

            $arrArbolPrimHijos = $this->conformarNodos($primerosHijos, $arriconos, $nivelachequear);
            foreach ($arrArbolPrimHijos as $k => &$v) {
                $arrHijos = $this->buscarHijosRecursivo($arbolEstCamino, $v, $arriconos, $nivelachequear);
                if (count($arrHijos) > 0) {
                    $v['children'] = $arrHijos;
                    $v['expanded'] = true;
                }
            }
            return $arrArbolPrimHijos;
        } else {
            return array();
        }
    }

    /* Funcion recursiva que conforma el arbol de la estructura a partir del segundo nivel del arbol */

    private function buscarHijosRecursivo($arreglo, $fila, $arriconos, $nivelachequear) {
        $arrArbolHijos = array();
        $arrHijos = $this->buscarHijosenArreglonoRepetidos($arreglo, $fila['id']);
        if (count($arrHijos) == 0) { //Condicion de parada 
            return;
        } else {
            $arrArbolHijos = $this->conformarNodos($arrHijos, $arriconos, $nivelachequear);
            foreach ($arrArbolHijos as $k => &$v) {
                $arrArbol = $this->buscarHijosRecursivo($arreglo, $v, $arriconos, $nivelachequear);
                if (count($arrArbol) > 0) {
                    $v['children'] = $arrArbol;
                    $v['expanded'] = true;
                }
            }
        }
        return $arrArbolHijos;
    }

    /* Funcion que busca en el arreglo de la consulta a la BD y encuentra los hijos del idestructura pasados como parametro */

    private function buscarHijosenArreglonoRepetidos($arreglo, $idestructura) {
        $arrHijos = array();
        foreach ($arreglo as $i => $v) {
            if ($v['idpadre'] == $idestructura) {
                if ($this->seRepite($arrHijos, $v['id']) == 1 && $v['id'] != $idestructura) {
                    $arrHijos[] = $v;
                }
            }
        }
        return $arrHijos;
    }

    /* Funcion que comprueba si el id se repite en el arreglo pasado como parametro */

    private function seRepite($arr, $id) {
        foreach ($arr as $k => $v) {
            if ($v['id'] == $id)
                return 2;
        }
        return 1;
    }

    /* Funcion que conforma un arreglo con los formatos de los tree nodos para ser enviados al servidor */

    private function conformarNodos($arrNodos, $arriconos, $nivelachequear) {
        $i = 0;
        $arr = array();
        foreach ($arrNodos as $valores => $valor) {
            if ($nivelachequear == -1) {
                $arr[$i]['leaf'] = $valor['eshoja'] == 1 ? true : false;
            } else {
                if ($valor['idtipo'] == $nivel) {
                    $arr[$i]['leaf'] = true;
                    $arr[$i]['checked'] = false;
                }
            }
            $icono = $valor['icono'];
            if ($icono != '') {
                $icono = '/metadatos/comun/recursos/iconos/' . $icono . '.gif';
            }
            $tipo = $this->buscarIcono($arriconos, $valor['idtipo']);
            $arr[$i]['id'] = $valor['id'];
            $arr[$i]['text'] = $valor['denominacion'];
            $arr[$i]['cls'] = $valor['original'] == '1' ? 'concepto-marcado' : '';
            $arr[$i]['denominacion'] = $valor['denominacion'];
            $arr[$i]['tipoestructura'] = $valor['idtipo'];
            $arr[$i]['tipo'] = $tipo;
            $arr[$i]['icon'] = $icono;
            $arr[$i]['qtip'] = '<p><b>' . $tipo . '</b></p>' . '<p>' . $valor['denominacion'] . '</p>';
            $i++;
        }
        return $arr;
    }

    public function obtenerSubordinacionAction(){
        $sqlSub = "SELECT distinct sub.idnomsubordinacion from mod_estructuracomp.nom_subordinacion sub
                                    where sub.abreviatura like 'nom';";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $idsub = $conn->fetchOne($sqlSub);
            echo json_encode($idsub);
        //print_r($idsub);die;
    }

}

?>
