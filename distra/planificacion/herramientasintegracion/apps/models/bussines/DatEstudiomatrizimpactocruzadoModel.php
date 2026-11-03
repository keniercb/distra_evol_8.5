<?php

class DatEstudiomatrizimpactocruzadoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function getVariables($idestudio) {
        return DatVariableimpactocruzado::getVariables($idestudio);
    }

    public function guardarVariables($idestudio, $objeto) {
        $mensaje = 'Algunas operaciones no pudieron ejecutarse: <br>';
        $mostMensajes = false;
        // caso ELIMINAR
        foreach ($objeto->del as $var) {
            $objVar = Doctrine::getTable('DatVariableimpactocruzado')->find($var->idvariable);
            $this->eliminarInformacion($objVar);
        }
        // caso MODIFICAR
        foreach ($objeto->mod as $var) {
            $objVar = Doctrine::getTable('DatVariableimpactocruzado')->find($var->idvariable);
            $q = Doctrine_Query::create()->from('DatVariableimpactocruzado v')->where('v.idestudiomatrizimpactocruzado =? AND v.denominacion =?', array($idestudio, $var->denominacion));
            $res = $q->fetchArray();
            if (count($res) > 0 && $res[0]['idvariable'] != $objVar->idvariable) {
                $mostMensajes = true;
                $mensaje .= '- ' . $var->denominacion . ' : La variable ya existe.<br>';
            } else {
                $objVar->denominacion = $var->denominacion;
                $objVar->descripcion = $var->descripcion;
                $this->guardarInformacion($objVar);
            }
        }
        // caso ADICIONAR
        foreach ($objeto->add as $var) {
            $q = Doctrine_Query::create()->from('DatVariableimpactocruzado v')->where('v.idestudiomatrizimpactocruzado =? AND v.denominacion =?', array($idestudio, $var->denominacion));
            $res = $q->fetchArray();
            if (!count($res)) {
                $objVar = new DatVariableimpactocruzado();
                $objVar->denominacion = $var->denominacion;
                $objVar->descripcion = $var->descripcion;
                $objVar->idestudiomatrizimpactocruzado = $idestudio;
                $this->guardarInformacion($objVar);
            } else {
                $mostMensajes = true;
                $mensaje .= '- ' . $var->denominacion . ' : La variable que quiere adicionar ya existe.<br>';
            }
        }
        
        if ($mostMensajes) {
            return array('success' => false,  'mostrarMens' => $mostMensajes, 'mensaje' => $mensaje);
        }else{
            return array('success' => true, 'accion' => $flash);
        }
        
    }

    public function guardarInformacion($obj) {
        try {
            if ($obj) {
                $obj->save();
            }
            return $obj;
        } catch (Exception $e) {
            print_r($e);
            die;
            return $e;
        }
    }

    public function eliminarInformacion($obj) {
        try {
            if ($obj) {
                $obj->delete();
            }
            return true;
        } catch (Exception $e) {
            print_r($e);
            die;
            return $e;
        }
    }

    public function getestudio($idproyecto) {
        $result = DatEstudiomatrizimpactocruzado::getByProyecto($idproyecto);
        return $result;
    }

    public function obtenerConfiguracionMatriz($idestudio) {
        $variables = DatVariableimpactocruzado::getVariables($idestudio);
        $fields = array(
            array("id" => "idvariable", "name" => "idvariable"),
            array("name" => "denominacion", "header" => "Variables")
        );
        foreach ($variables as $value) {
            $fields[] = array(
                "name" => $value['idvariable'],
                "header" => $value['denominacion'],
            );
        }
        return $fields;
    }

    public function obtenerdatosmatrizimpactocruzado($idestudio) {
        $variables = DatVariableimpactocruzado::getVariables($idestudio);
        $result = array();
        foreach ($variables as $i => $value) {
            $datos = DatMatrizimpactocruzado::getByidFila($value['idvariable']);
            $result[$i]['idvariable'] = $value['idvariable'];
            $result[$i]['denominacion'] = $value['denominacion'];
            foreach ($datos as $key) {
                $result[$i][$key[idvariablecolumna]] = $key[idimpacto];
            }
        }
        return $result;
    }

    public function obtenerdatosmatrizimpactocruzadoDen($idestudio) {

        $variables = DatVariableimpactocruzado::getVariables($idestudio);
        $result = array();
        $result['columnas'][] = 'Variables';
        $result['referencia'][] = 'Variables';

        foreach ($variables as $i => $value) {
            $datos = DatMatrizimpactocruzado::getVariableImpactoByidFila($value['idvariable']);
            $result['data'][$i]['Variables'] = $value['denominacion'];
            foreach ($datos as $key) {
                $result['data'][$i][$key['variable']] = $key['impacto'];
            }
            $result['data'][$i][$value['denominacion']] = '&';

            $result['columnas'][] = $value['denominacion'];
            $result['referencia'][] = $value['denominacion'];
        }


        return $result;
    }

    public function obtenerimpacto() {
        return NomImpactoflujos::getAll();
    }

    public function savematrizimpactocruzado($objeto) {
        $obj = DatMatrizimpactocruzado::getByFilaColumna($objeto['idvariablefila'], $objeto['idvariablecolumna']);
        If ($obj->count()) {
            $obj = $obj->getFirst();
            $obj->idimpacto = $objeto['idimpacto'];
        } else {
            $obj = new DatMatrizimpactocruzado();
            $obj->idvariablefila = $objeto['idvariablefila'];
            $obj->idvariablecolumna = $objeto['idvariablecolumna'];
            $obj->idimpacto = $objeto['idimpacto'];
        }
        //print_r($obj);die;
        try {
            if ($obj) {
                $obj->save();
            }
            return $obj;
        } catch (Exception $e) {
            print_r($e);
            die;
            return $e;
        }
    }

    public function obtenermatrizimpactocruzadoresultado($idestudio) {
        $variables = DatVariableimpactocruzado::getVariables($idestudio);
        $res = array();
        $total = 0;
        foreach ($variables as $value) {
            $datos = DatMatrizimpactocruzado::getByidFilaconPesoImpacto($value['idvariable']);
            $suma = 0;
            foreach ($datos as $key) {
                $suma += abs($key['NomImpactoflujos']['peso']);
            }
            $total += $suma;
            $res[] = array(
                'denominacion' => $value['denominacion'],
                'descripcion' => $value['descripcion'],
                'suma' => $suma
            );
        }
        for ($j = 0; $j < count($res); $j++) {
            for ($i = 0; $i < count($res); $i++) {
                if ($res[$j]['suma'] > $res[$i]['suma']) {
                    $value = $res[$j];
                    $res[$j] = $res[$i];
                    $res[$i] = $value;
                }
            }
        }
        $acumulado = 0;
        foreach ($res as $i => $value) {
            $res[$i]['porciento'] = $res[$i]['suma'] * 100 / $total;
            $acumulado += $res[$i]['porciento'];
            $res[$i]['acumulado'] = $acumulado;
        }
        return $res;
    }

    public function obtenerdatosgraficoflujo($idestudio, $idvariables) {
        $nodes = DatVariableimpactocruzado::getVariablesasNodes($idestudio, $idvariables);

        foreach($nodes as $key => $objNode){
            $nodes[$key]['title'] = $this->partirCadena($objNode['descripcion'], 20);
            $nodes[$key]['label'] = $this->partirCadena($objNode['label'], 20);
        }

        $edges = DatMatrizimpactocruzado::getByidFilaasEdges($idvariables);
        foreach ($edges as $i => $key) {
            $edges[$i]['arrows'] = 'to';
            switch ($key['label']) {
                case 3 :
                    $edges[$i]['color'] = array('color' => 'green');
                    break;
                case 2 :
                    $edges[$i]['color'] = array('color' => 'blue');
                    $edges[$i]['dashes'] = array(10, 6);
                    break;
                case 1 :
                    $edges[$i]['color'] = array('color' => 'purple');
                    $edges[$i]['dashes'] = array(2, 5);
                    break;
                case -3 :
                    $edges[$i]['color'] = array('color' => 'red');
                    break;
                case -2 :
                    $edges[$i]['color'] = array('color' => 'orange');
                    $edges[$i]['dashes'] = array(10, 6);
                    break;
                case -1 :
                    $edges[$i]['color'] = array('color' => 'gold');
                    $edges[$i]['dashes'] = array(2, 5);
                    break;
                case 0 :
                    $edges[$i] = null;
                    break;
            }
        }
        return array('nodes' => $nodes, 'edges' => $edges);
    }

    public function partirCadena($cadena, $longitud){
        $cadena1 = $cadena;
        if(strlen($cadena1) > $longitud){
            $cadena = wordwrap($cadena1, $longitud, "\n", false);
        }
        return $cadena;
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getByProyecto
     * @param $idProyecto :Identificador del proyecto
     * @use Funcion para obtener el estudio a sociado al proyecto
     * @return mixed
     */
    public static function getByProyecto($idProyecto) {
        return DatEstudiomatrizimpactocruzado::getByProyecto($idProyecto);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausasByEstudio
     * @param $idEstudio :Identificador del estudio
     * @param $start : Inicio de la selecciona de datos
     * @param $limit : Cantidad de elementos a seleccionar
     * @use Funcion para obtener las variables de las matriz como causas
     * @return mixed
     */
    public static function getCausasByEstudio($idEstudio, $start, $limit) {
        return DatVariableimpactocruzado::getCausasByEstudio($idEstudio, $start, $limit);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausaDenominacion
     * @param $idEstudio :Identificador del estudio
     * @param $idCausa :Identificador de la causa (variable)
     * @use Funcion para obtener la denominacion de la causa
     * @return mixed
     */
    public static function getCausaDenominacion($idEstudio, $idCausa) {
        return DatVariableimpactocruzado::getVariables($idEstudio, $idCausa);
    }

    public  function getDatosReporte($params) {

        $data = array();

        switch ($params['tipo']) {

            case 'matriz':

                $variables = $this->getVariables($params['data']);
                $matriz = $this->obtenerdatosmatrizimpactocruzadoDen($params['data']);
                $resultado = $this->obtenermatrizimpactocruzadoresultado($params['data']);

                $data[0]->tipo = 'descripcion';
                $data[0]->columnas = array('Denominación');
                $data[0]->referencia = array('denominacion');
                $data[0]->nombredescripcion = 'Descripción';
                $data[0]->encabezado = 'Listado de variables';
                $data[0]->datos = $variables;

                $data[1]->tipo = 'matriz';
                $data[1]->columnas = $matriz['columnas'];
                $data[1]->referencia = $matriz['referencia'];
                $data[1]->nombredescripcion = 'Descripción';
                $data[1]->encabezado = 'Matriz impacto cruzado';
                $data[1]->datos = $matriz['data'];

                $data[2]->tipo = 'estandar';
                $data[2]->columnas = array('Variable', 'Suma', '%', '% acumulado');
                $data[2]->referencia = array('denominacion', 'suma', 'porciento', 'acumulado');
                $data[2]->nombredescripcion = 'Descripción';
                $data[2]->encabezado = 'Resultado matriz de impacto cruzado';
                $data[2]->datos = $resultado;

                $data['informe'] = 'Informe de la matriz de impacto cruzado';

                break;

            case 'flujocausal':

                $data[0]->tipo = 'estandar';
                $data[0]->columnas = array('Abreviatura','Denominación');
                $data[0]->referencia = array('denominacion', 'descripcion');
                $data[0]->encabezado = 'Listado de variables seleccionadas';
                $data[0]->datos = $params['data'];

                $data[1]->tipo = 'leyenda-image';
                $data[1]->image = $params['image'];
                $data[1]->encabezado = 'Diagrama de flujos causales';

                $data['informe'] = 'Informe del diagrama de flujos causales';

                break;
        }



        return $data;
    }

}
