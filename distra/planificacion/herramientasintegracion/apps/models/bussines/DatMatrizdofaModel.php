<?php

class DatMatrizdofaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getListadosByAmbito($arreglo)
    {
        $a = new DatFactor();
        $p = $a->getFactoresByAmbito($arreglo);
        return $p;
    }

    public function insertarModificarFactor($arreglo)
    {

        //todo revisar esto
        $a = new DatMatrizdofa();
        $objvalidators = new FactoresValidator();
        if ($arreglo['idmatrizdofa'] > 0) {
            $fact = DatFactor::getByid($arreglo['idfactor']);
            if (ZendExt_Validation_Texto::Ascii($fact->denominacion) != ZendExt_Validation_Texto::Ascii(strtolower($arreglo['denominacion']))) {
                if ($objvalidators->validarDenominacion('DatFactor', trim($arreglo['denominacion']))) {
                    $fact->idfactorclave = $arreglo['idfactorclave'];
                    $fact->denominacion = $arreglo['denominacion'];
                } else
                    throw new ZendExt_Exception('CHI12688');
            } else {
                $fact->idfactorclave = $arreglo['idfactorclave'];
                $fact->denominacion = $arreglo['denominacion'];
            }
            $p = DatFactor::salvarFactor($fact);
        } else {
            if ($objvalidators->validarDenominacion('DatFactor', trim($arreglo['denominacion']))) {
                $a->idestudiomatrizdofa = $arreglo['idestudiomatriz'];
                $a->idpersona = $arreglo['idpersona'];
                $a->idambitodofa = $arreglo['idambitodofa'];
                $a->analista = $arreglo['analista'];
                $p = DatMatrizdofa::salvarMatrizDofa($a);

                $fact = new DatFactor();
                $fact->idmatrizdofa = $p;
                $fact->idfactorclave = $arreglo['idfactorclave'];
                $fact->denominacion = $arreglo['denominacion'];
                $p = DatFactor::salvarFactor($fact);
            } else
                throw new ZendExt_Exception('CHI1268');
        }
        return $p;
    }

    public function eliminarFactor($objeto)
    {

        $objFactor = DatFactor::getByid($objeto->idfactor);
        $p = DatFactor::eliminarFactor($objFactor);
        return $p;
    }

    public function getFortalezasDebilidades($arreglo)
    {
        $a = new DatFactor();
        $p = $a->getFortalezasDebilidades($arreglo);
        return $p;
    }

    public function getListadosByNomFactorXPares($arreglo)
    {
        $a = new DatEstrategia();
        $p = $a->getListadosByNomFactorXPares($arreglo);
        return $p;
    }

    public function insertarModificarEstrategia($arreglo)
    {
        $a = new DatEstrategia();
        $objvalidators = new FactoresValidator();
        if ($arreglo['idestrategia'] > 0) {
            if ($objvalidators->validarEstrategia($arreglo)) {
            $estrategia = DatEstrategia::getByid($arreglo['idestrategia']);
            $estrategia->denominacion = $arreglo['denominacion'];
            $p = DatEstrategia::salvarEstrategia($estrategia);
            } else {
                throw new ZendExt_Exception('CHI1267');
            }
        } else {
            if ($objvalidators->validarEstrategia($arreglo)) {
                $a->idmatrizdofa = $arreglo['idmatrizdofa'];
                $a->idambitodofa = $arreglo['idambitodofa'];
                $a->denominacion = $arreglo['denominacion'];
                $a->idfactorclave1 = $arreglo['idfactorclave1'];
                $a->idfactorclave2 = $arreglo['idfactorclave2'];
                $a->experto = $arreglo['analista'];
                $p = DatEstrategia::salvarEstrategia($a);

            } else {
                throw new ZendExt_Exception('CHI12677');
            }
        }
        return $p;
    }

    public function eliminarEstrategia($objeto)
    {
        $objEstrategia = DatEstrategia::getByid($objeto->idestrategia);
        $p = DatEstrategia::eliminarEstrategia($objEstrategia);
        return $p;
    }

    public function getEstrategias($arreglo)
    {
        $a = new DatEstrategia();
        $p = $a->getEstrategias($arreglo);
        return $p;
    }

    public function obtenerConfiguracionMatrizDofa($p)
    {
        $criterio = $p['arreglo'];
        $fields = array(
            array("id" => "idestrategia", "name" => "idestrategia"),
            array("name" => "denominacion", "header" => "Estrategias/Criterio"),
            array("name" => "tipo", "header" => "Tipo")

        );
        foreach ($criterio as $value) {
            $fields[] = array(
                "name" => $value['idcriterio'],
                "header" => $value['denominacion'],
                "descripcion" => $value['descripcion']
            );
        }
        return $fields;
    }

    public function gestionarcruce($objeto, $accion)
    {
        $obj = DatCriterioestrategia::getByFilaColumna($objeto['idcriterio'], $objeto['idestrategia']);
        If ($obj->count()) {
            $obj = $obj->getFirst();
        } else {
            $obj = new DatCriterioestrategia();
            $obj->idcriterio = $objeto['idcriterio'];
            $obj->idestrategia = $objeto['idestrategia'];
        }
        try {
            if ($obj && $accion === 'delete') {
                $obj->delete();
            } else {
                $obj->save();
            }

            return $obj;
        } catch (Exception $e) {
            print_r($e);
            die;
            return $e;
        }
    }

    public function saveCriterios($p)
    {
        try {
            $res = 4;
            //CASO ELIMINAR
            $eliminadas = $p['del'];
            foreach ($eliminadas as $value) {
                $query = new Doctrine_Query ();
                try {
                    $idcriterio = $value['idcriterio'];
                    $result = $query->delete()->from('NomCriterio')->where("idcriterio = '$idcriterio'")->execute();
                    $res = 1;
                } catch (Exception $e) {
                    if ($e->GetCode() == 23503) {
                        Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
                        $sql = "update mod_planifintegracion.nom_criterio set fechafin = CURRENT_DATE where idcriterio  = $idcriterio";
                        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql);
                    }
                }
            }

            // CASO MODIFICAR
            $modificadas = $p['mod'];
            foreach ($modificadas as $value) {
                $indicador = Doctrine::getTable('NomCriterio')->find($value['idcriterio']);
                if ($value['denominacion'])
                    $indicador->denominacion = $value['denominacion'];
                if ($value['descripcion'])
                    $indicador->descripcion = $value['descripcion'];
                if ($value['fechafin'])
                    $indicador->fechafin = $value['fechafin'];
                $indicador->save();
                $res = 2;
            }
            // CASO ADICIONAR
            $adicionadas = $p['add'];
            foreach ($adicionadas as $value) {
                $indicador = new NomCriterio();
                if ($value['denominacion'])
                    $indicador->denominacion = $value['denominacion'];
                if ($value['descripcion'])
                    $indicador->descripcion = $value['descripcion'];
                if ($value['fechafin'])
                    $indicador->fechafin = $value['fechafin'];
                $indicador->save();
                $res = 2;
            }
            return array('success' => true, 'fmpeir' => $res);
        } catch (Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage());
        }
    }

    /**
     * Obtiene todos los datos necesarios para generar reporte
     *
     * @param $idestudio
     * @param $idproyecto
     *
     * @return array
     * @author    Ing. Dasley Tejeda Puentes
     * @copyrigth XETID, Cuba
     */
    public function getDatosReporte($params) {

        $model = new DatEstudiomatrizdofaModel();
        $ambitos = $model->getTreeAmbitos();

        $output = array();
        $outputfactores = array();
        $index = 0;


        /*Matrices de Análisis y Estrategias de los especialistas y expertos por cada ambito*/

        while ($index <= 2) {

            $result = array();
            $resultfactor = array();
            $aux = array();

            foreach ($ambitos as $i => $ambito) {

                $fortaleza = 0;
                $debilidad = 0;
                $amenaza = 0;
                $oportunidad = 0;
                $data = array();
                $datafactor = array();
                $datafactorlist = array();

                $arreglo['start'] = -1;
                $arreglo['limit'] = -1;
                $arreglo['analista'] = $index == 0 ? 'true' : 'false';
                $arreglo['idambitodofa'] = $ambito['idambitodofa'];
                $arreglo['idestudiomatriz'] = $params['idestudiomatriz'];
                $factores = $this->getListadosByAmbito($arreglo);

                foreach ($factores['root'] as $factor) {

                    switch ($factor['denomNomFactor']) {

                        case 'Fortalezas':
                            $data[$fortaleza]['Fortalezas'] = $factor['denominacion'];
                            $fortaleza ++;
                            break;

                        case 'Debilidades':
                            $data[$debilidad]['Debilidades'] = $factor['denominacion'];
                            $debilidad ++;
                            break;

                        case 'Amenazas':
                            $data[$amenaza]['Amenazas'] = $factor['denominacion'];
                            $amenaza ++;
                            break;

                        case 'Oportunidades':
                            $data[$oportunidad]['Oportunidades'] = $factor['denominacion'];
                            $oportunidad ++;
                            break;
                    }
                }

                for ($j = 0; $j < 4; $j++) {

                    switch ($j) {

                        case 0:
                            $arreglo['factorclave1'] = '4';
                            $arreglo['factorclave2'] = '3';
                            break;

                        case 1:
                            $arreglo['factorclave1'] = '4';
                            $arreglo['factorclave2'] = '1';
                            break;

                        case 2:
                            $arreglo['factorclave1'] = '2';
                            $arreglo['factorclave2'] = '3';
                            break;

                        case 3:
                            $arreglo['factorclave1'] = '2';
                            $arreglo['factorclave2'] = '1';
                            break;
                    }

                    $factorxpares = $this->getListadosByNomFactorXPares($arreglo);

                    if ($j%2 == 0) {
                        $aux['list1'] = $factorxpares['root'];
                    } else {
                        $aux['list2'] = $factorxpares['root'];
                    }

                    if ($j%2 != 0) {
                        $max  = count($aux['list1']) >= count($aux['list2']) ?
                            count($aux['list1']) : count($aux['list2']);

                        for ($k = 0; $k < $max; $k++) {
                            if ($aux['list1'][$k]) {
                                $datafactor[$k]['campo1'] = $aux['list1'][$k]['denominacion'];
                            }

                            if ($aux['list2'][$k]) {
                                $datafactor[$k]['campo2'] = $aux['list2'][$k]['denominacion'];
                            }
                        }

                        if ($j == 1) {
                            $datafactorlist[0]->columnas = array('Amenazas-Fortalezas','Amenazas-Debilidades');
                            $datafactorlist[0]->referencia = array('campo1','campo2');
                        } else {
                            $datafactorlist[1]->columnas = array('Oportunidades-Fortalezas','Oportunidades-Debilidades');
                            $datafactorlist[1]->referencia = array('campo1','campo2');
                        }

                        $datafactorlist[($j == 1) ? 0 : 1]->datos = $datafactor;
                        $datafactor = array();

                    }
                }

                $result[$i]->columnas = array('Fortalezas','Debilidades','Amenazas', 'Oportunidades');
                $result[$i]->referencia = array('Fortalezas','Debilidades','Amenazas', 'Oportunidades');
                $result[$i]->datos = $data;
                $result[$i]->encabezado = 'Ámbito - '.$ambito['denominacion'];

                $resultfactor[$i]->encabezado = $result[$i]->encabezado;
                $resultfactor[$i]->datos = $datafactorlist;
            }


            $output[$index]->tipo = 'epigrafe';
            $output[$index]->variante = 'h4';
            $output[$index]->text = $index == 0 ? 'Análisis de los especialistas' : 'Análisis de los expertos';

            $output[$index + 1]->tipo = 'multi-estandar';
            $output[$index + 1]->datos = $result;

            $outputfactores[$index]->tipo = 'epigrafe';
            $outputfactores[$index]->variante = 'h4';
            $outputfactores[$index]->text = $index == 0 ? 'Estrategias de los especialistas' : 'Estrategias de los expertos';

            $outputfactores[$index + 1]->tipo = 'multi-header';
            $outputfactores[$index + 1]->datos = $resultfactor;

            $index = $index + 2;

        }

        /*Matriz de factores vs criterios*/

        $p['denominacion']= '';
        $p['fechaini']= '';
        $p['fechafin']= '';

        $criterios = NomCriterio::getCriterios($p);
        $p['arreglo'] = $criterios;
        $headers = $this->obtenerConfiguracionMatrizDofa($p);

        $arreglo1['idmatrizdofa'] = $params['idestudiomatriz'];
        $arreglo1['start'] = -1;
        $arreglo1['limit'] = -1;

        $estrategias = $this->getEstrategias($arreglo1);
        $columnasT = array();
        $rowsGroup = array();

        foreach ($estrategias['root'] as $i => $estrategia) {
            foreach ($headers as $header) {
                if ($header['header'] && $header['header'] != 'Tipo') {

                     if ((count($columnasT) < count($headers) - 2)) {
                         $columnasT[] = $header['header'];
                     }

                    if ($estrategia[$header['name']] == true) {
                        if (is_numeric($header['name'])){
                            $rowsGroup[$i][$header['header']] = '<b>X</b>';
                        } else {
                            $rowsGroup[$i][$header['header']] = $estrategia['denominacion'];
                        }
                    }
                    else {
                        $rowsGroup[$i][$header['header']] = '-';
                    }
                }

                $rowsGroup[$i]['group'] = $estrategia['tipo'];
            }
        }

        $matrizC = array();
        $matrizC[0]->tipo = 'epigrafe';
        $matrizC[0]->variante = 'h2';
        $matrizC[0]->text = 'Resultados de la confrontación DOFA';
        $matrizC[1]->tipo = 'group-estandar';
        $matrizC[1]->columnas = $columnasT;
        $matrizC[1]->referencia = $columnasT;
        $matrizC[1]->groupReferent = 'group';
        $matrizC[1]->groups = array('Analista', 'Experto');
        $matrizC[1]->encabezado = 'Listado de estrategias y criterios por especialistas';
        $matrizC[1]->datos = $rowsGroup;

        /*Listado de estrategias jerarquizadas*/

        $arreglo1['orden'] = 'TRUE';
        $listadoEstrategiasJerarquicas = $this->getEstrategias($arreglo1);

        $estrategiasJ = array();
        $estrategiasJ[0]->tipo = 'estandar';
        $estrategiasJ[0]->columnas = array('No.','Estrategia');
        $estrategiasJ[0]->referencia = array('orden', 'denominacion');
        $estrategiasJ[0]->encabezado = 'Listado de estrategias jerarquizadas';
        $estrategiasJ[0]->datos = $listadoEstrategiasJerarquicas['root'];

        $epigrafe1 = array();
        $epigrafe1[0]->tipo = 'epigrafe';
        $epigrafe1[0]->variante = 'h2';
        $epigrafe1[0]->text = '1. Diseño de acciones estratégicas';

        $epigrafe2 = array();
        $epigrafe2[0]->tipo = 'epigrafe';
        $epigrafe2[0]->variante = 'h2';
        $epigrafe2[0]->text = '2. Estrategias';

        $epigrafe3 = array();
        $epigrafe3[0]->tipo = 'epigrafe';
        $epigrafe3[0]->variante = 'h2';
        $epigrafe3[0]->text = '3. Análisis de estrategias';

        return array_merge($epigrafe1, $output, $epigrafe2,
            $outputfactores, $epigrafe3, $matrizC, $estrategiasJ);
    }

}
