<?php

class DatEstudiofmpeirmatrizModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function obtenerEstudioByProyecto($idproyecto)
    {
        return DatEstudiomatrizfmpeir::obtenerEstudioByProyecto($idproyecto);
    }

    public function guardarDatos($p)
    {
        try {
            $proyecto = new DatEstudiomatrizfmpeir();
            if ($p['idproyecto'] > 0) {
                $proyecto = Doctrine::getTable('DatEstudiomatrizfmpeir')->findBy('idproyecto', $p['idproyecto']);
                $proyecto[0]->descripcion = $p['descripcion'];
                $proyecto[0]->save();
                $res = $proyecto[0]->idestudiomatrizfmpeir;
                return array('success' => true, 'idestudiomatrizfmpeir' => $res);
            }
        } catch (exc $e) {
            print_r($e->getMessage());
            die;
        }
    }

    public function adicionarmatrizlogica($p)
    {
        try {
            $indicador = new DatMatrizfmpeir();
            $proyecto = new DatEstudiomatrizfmpeir();
            $elementofm = new DatElementofuerzamotriz();

            $select = " select e.idestudiomatrizfmpeir";
            $from = " from mod_planifintegracion.dat_estudiomatrizfmpeir e";
            $where = " where e.idproyecto ={$p['idproyecto']}";
            $sql = $select . $from . $where;


            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            if ($result[0]['idestudiomatrizfmpeir']) {
                $idproyecto = $result[0]['idestudiomatrizfmpeir'];
            } else {
                if ($p['idproyecto'])
                    $proyecto->idproyecto = $p['idproyecto'];

                $proyecto->save();
                $idproyecto = $proyecto->idestudiomatrizfmpeir;
            }
            //Elminar
            if ($p['delete']) {
                $obj['idestudiomatrizfmpeir'] = $idproyecto;
                $obj['orden'] = $p['orden'];
                $del = DatEstudiomatrizfmpeir::obtenerdatosmatriz($obj);
                foreach ($del as $value) {
                    $res = Doctrine::getTable('DatMatrizfmpeir')->find($value['idmatrizfmpeir']);
                    if ($res->idmatrizfmpeir) {
                        $indicador->idmatrizfmpeir = $res->idmatrizfmpeir;
                        $res->delete();
                    }
                }
                $obj1['idestudiomatrizfmpeir'] = $idproyecto;
                $obj1['orden'] = '';
                $todas = DatEstudiomatrizfmpeir::obtenerdatosmatriz($obj1);
                foreach ($todas as $value1) {
                    $res = Doctrine::getTable('DatMatrizfmpeir')->find($value1['idmatrizfmpeir']);
                    if ($res->orden > $p['orden']) {
                        $res->orden = $res->orden - 1;
                        $res->save();
                    }
                }
            } else {

                $select = " select e.idelementofuerzamotriz";
                $from = " from mod_planifintegracion.dat_elementofuerzamotriz e";
                $where = " where e.idfuerzamotriz = {$p['idfuerzamotriz']}  and e.idelementopeir = {$p['idelementopeir']} and e.idindicadorfmpeir ={$p['idindicadorfmpeir']}";
                $sql = $select . $from . $where;
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                //Modificar
                if (!empty($p['record'])) {
                    $obj['idestudiomatrizfmpeir'] = $idproyecto;
                    $obj['orden'] = $p['orden'];
                    $obj['idfuerzamotriz'] = $p['idfuerzamotriz'];
                    switch ($p['idfuerzamotriz']) {
                        case 1:
                            $obj['denominacion'] = $p['record']['presion'];
                            break;
                        case 2:
                            $obj['denominacion'] = $p['record']['estado'];
                            break;
                        case 3:
                            $obj['denominacion'] = $p['record']['impacto'];
                            break;
                        case 4:
                            $obj['denominacion'] = $p['record']['respuesta'];
                            break;
                    }
                    $mod = DatEstudiomatrizfmpeir::obtenerdatosmatriz($obj);
                    $indicador = Doctrine::getTable('DatMatrizfmpeir')->find($mod[0]['idmatrizfmpeir']);

                }
                //Adicionar
                if ($result[0]['idelementofuerzamotriz'])
                    $indicador->idelementofuerzamotriz = $result[0]['idelementofuerzamotriz'];
                if ($idproyecto)
                    $indicador->idestudiomatrizfmpeir = $idproyecto;
                if ($p['valor'])
                    $indicador->valor = $p['valor'];
                $indicador->orden = $p['orden'];

                $indicador->save();
            }
            return array('success' => true, 'idmatrizfmpeir' => $indicador->idmatrizfmpeir);
        } catch (Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage());
        }
    }

    public function getDatosReporte($params)
    {

        $data = array();
        $matriz = $this->obtenerMatriz($params['idproyecto']);


        $data[0]->tipo = 'estandar';
        $data[0]->columnas = array('Elemento', 'Estado', 'Valor', 'Presión', 'Valor', 'Impacto', 'Valor', 'Respuesta', 'Valor');
        $data[0]->referencia = array('elemento', 'estado', 'valor1', 'presion',
            'valor', 'impacto', 'valor2', 'respuesta', 'valor3');
        $data[0]->encabezado = 'Matriz de integración lógica';
        $data[0]->datos = $matriz['data'];

        $aux = array('estado', 'presion', 'impacto', 'respuesta');
        $aux1 = array('Estado', 'Presión', 'Impacto', 'Respuesta');
        $auxfm = array('2', '1', '3', '4');
        $auxelem = array();
        $flag = false;
        $index = 1;
        $indexelem = 0;

        foreach ($matriz['data'] as $pos => $value) {
            foreach ($aux as $key => $auxvalue) {
                if ($value[$auxvalue]) {
                    $p['idfuerzamotriz'] = $auxfm[$key];
                    $p['idelementopeir'] = $value['idelementopeir'];
                    foreach ($auxelem as $element) {
                        if ($p['idfuerzamotriz'] == $element['idfuerzamotriz'] &&
                            $p['idelementopeir'] == $element['idelementopeir']
                        ) {
                            $flag = true;
                            break;
                        }
                    }

                    if (!$flag) {
                        $auxelem[$indexelem]['idfuerzamotriz'] = $p['idfuerzamotriz'];
                        $auxelem[$indexelem]['idelementopeir'] = $p['idelementopeir'];
                        $indexelem++;
                        $flag = false;

                        $result = $this->obtenerindicadordeintegracion($p);

                        if ($result['data'] && count($result['data'])) {
                            $data[$index]->encabezado = $value['elemento'] . ' - ' . $aux1[$key];
                            $data[$index]->tipo = 'estandar';
                            $data[$index]->columnas = array('Denominación del indicador', 'Fuente');
                            $data[$index]->referencia = array('denominacion', 'fuente');
                            $data[$index]->datos = $result['data'];
                            $index += 1;
                        }
                    }

                    $flag = false;
                }
            }
        }

        $data[$index]->encabezado = 'Descripción';
        $data[$index]->tipo = 'resumen';
        $data[$index]->datos = isset($params['descripcion']) ? $params['descripcion'] : '';

        return $data;
    }

    public function obtenerMatriz($idproyecto)
    {
        //Obtengo el estudio del proyecto
        $estudio = DatEstudiomatrizfmpeir::obtenerEstudioByProyecto($idproyecto);
        //Obtengo la matriz de fmpeir perteneciente a ese estudio
        $matriz = DatEstudiomatrizfmpeir::obtenermatrizfmpeir($estudio->idestudiomatrizfmpeir);

        $aux = array();
        foreach ($matriz as $index => $objMatriz) {
            $orden = $objMatriz['orden'];
            $aux[$orden][] = $objMatriz;
        }
        $long = count($aux);

        $aux1 = array();
        for ($i = 0; $i < $long; $i++) {
            $aux1[$i] = $aux[$i];
        }

        $result = array();

        foreach ($aux1 as $key => $objAux) {
            $result[$key]['idelementopeir'] = $objAux[0]['DatElementofuerzamotriz']['NomElementopeir']['idelementopeir'];
            $result[$key]['elemento'] = $objAux[0]['DatElementofuerzamotriz']['NomElementopeir']['denominacion'];

            $aux2 = $objAux;
            foreach ($aux2 as $key2 => $objAux2) {
                $caso = $objAux2['DatElementofuerzamotriz']['NomFuerzamotriz']['idfuerzamotriz'];
                switch ($caso) {
                    case 1:
                        $result[$key]['presion'] = $this->partirCadena($objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['denominacion'], 20);
                        $result[$key]['idindicadorfmpeir'] = $objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['idindicadorfmpeir'];
                        $result[$key]['idelementofuerzamotriz'] = $objAux2['DatElementofuerzamotriz']['idelementofuerzamotriz'];
                        $result[$key]['valor'] = $this->partirCadena($objAux2['valor'], 10);
                        break;
                    case 2:
                        $result[$key]['estado'] = $this->partirCadena($objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['denominacion'], 20);
                        $result[$key]['idindicadorfmpeir'] = $objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['idindicadorfmpeir'];
                        $result[$key]['idelementofuerzamotriz'] = $objAux2['DatElementofuerzamotriz']['idelementofuerzamotriz'];
                        $result[$key]['valor1'] = $this->partirCadena($objAux2['valor'], 10);
                        break;
                    case 3:
                        $result[$key]['impacto'] = $this->partirCadena($objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['denominacion'], 20);
                        $result[$key]['idelementofuerzamotriz'] = $objAux2['DatElementofuerzamotriz']['idelementofuerzamotriz'];
                        $result[$key]['idindicadorfmpeir'] = $objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['idindicadorfmpeir'];
                        $result[$key]['valor2'] = $this->partirCadena($objAux2['valor'], 10);
                        break;
                    case 4:
                        $result[$key]['respuesta'] = $this->partirCadena($objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['denominacion'], 20);
                        $result[$key]['idelementofuerzamotriz'] = $objAux2['DatElementofuerzamotriz']['idelementofuerzamotriz'];
                        $result[$key]['idindicadorfmpeir'] = $objAux2['DatElementofuerzamotriz']['DatIndicadorfmpeir']['idindicadorfmpeir'];
                        $result[$key]['valor3'] = $this->partirCadena($objAux2['valor'], 10);
                        break;
                }

            }

        }
        return array('data' => $result, 'cantidad_filas' => count($result));

    }

    public function partirCadena($cadena, $longitud)
    {
        $cadena1 = $cadena;
        if (strlen($cadena1) > $longitud) {
            $cadena = wordwrap($cadena1, $longitud, "\n", false);
        }
        return $cadena;
    }

    public function obtenerindicadordeintegracion($p)
    {
        $_integrator = ZendExt_IoC::getInstance();

        $select = "select i.idfuente, i.denominacion, i.descripcion, i.idindicadorfmpeir";
        $from = " from mod_planifintegracion.dat_indicadorfmpeir i ";
        $innerjoin = " inner join mod_planifintegracion.dat_elementofuerzamotriz e on (i.idindicadorfmpeir = e.idindicadorfmpeir)";
        $lesft = " left join mod_planifintegracion.nom_elementopeir el on (e.idelementopeir = el.idelementopeir)";
        $lesft .= " left join mod_planifintegracion.nom_fuerzamotriz f on (f.idfuerzamotriz = e.idfuerzamotriz)";
        $where = " where e.idelementopeir = {$p['idelementopeir']} and e.idfuerzamotriz = {$p['idfuerzamotriz']} ";
        if ($p['fuente'] != '')
            $where .= " and i.idfuente = {$p['fuente']} ";
        if ($p['denominacion'])
            $where .= " and lower(i.denominacion) like '%" . strtolower($p['denominacion']) . "%'  ";

        $orderBy = " ORDER BY i.denominacion asc; ";
        $sql = $select . $from . $innerjoin . $lesft . $where . $orderBy;

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $pos => $res) {
            $actor = $_integrator->actoresfuentes->getActor($res['idfuente']);
            $res['fuente'] = $actor['Estructura']['denominacion'];
            $result[$pos] = $res;
        }
        return array('success' => true, 'data' => $result, 'cantidad_filas' => count($result));
    }

}
