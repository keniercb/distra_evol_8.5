<?php

/**
 * Modelo de negocio para gestionar los elementos salariales al cargo.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfigElementoSalarialCargoModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfigElementoSalarialCargoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfigElementoSalarialCargoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerListadoConfigElementoSalarial($inicio = 0, $limite = 10)
    {
        //Retornando el listado de tipos de nómina.
        return ConfigElementoSalarialCargo::obtenerListadoElementosSalariales($inicio, $limite);
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    /* public function obtenerListadoElementoSalXIdcargo($idcargo, $inicio = 0, $limite = 10) {
         //Retornando el listado de tipos de nómina.
         return ConfigElementoSalarialCargo::obtenerListadoElemSalXIdcargo($idcargo, $inicio, $limite);
     } */


    /**
     * Obtener la cantidad total de tipos de nómina.
     *
     * @return int Cantidad total de tipos de nómina.
     */
    public function obtenerCantidadElementosSalariales()
    {

        //Retornando la cantidad total de tipos de nómina.
        return ConfigElementoSalarialCargo::obtenerCantidadElementosSalariales();
    }

    public function obtenerCantidadTotalElemSalCargo($idcargo)
    {
        $objElemSal = new ConfigElementoSalarialCargo();
        $cant = $objElemSal->obtenerCantidadTotalElemSalCargo($idcargo);
        return $cant;
    }

    public function obtenerElemSalCargo($idcargo)
    {
        $objElemSal = new ConfigElementoSalarialCargo();
        $arr = $objElemSal->obtenerElemSalCargo($idcargo);
        return $arr;
    }

    /**
     * Insertar un tipo de nómina.
     *
     * @param string $denom Denominacion del tipo de nómina.
     * @param string $finicio Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin Fecha de fin de uso del tipo de nómina.
     * @param string $descrip Descripcion del tipo de nómina.
     */
    public function adicionarElementoSalarial($tiposalarioescala, $idsistpago, $idperiodopago, $idgrupoescala, $idsector, $idescalasueldocargo, $importe, $finicio, $ffin, $idcargo)
    {
        $objConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
        foreach ($idcargo as $i => $v) {
            $cantelemsalariales = $objConfigElementoSalarialCargo->obtenerCantidadTotalElemSalCargo($v);
            if($cantelemsalariales == 0){
                $objDomain = new ConfigElementoSalarialCargo();
                $datoscargo = $this->integrator->metadatos->obtenerDatosCargo($v);

                $objDomain->idsistemapago = $idsistpago;
                $objDomain->idperiodopago = $idperiodopago;//print_r($idgrupoescala);die;

                if ($tiposalarioescala == 1) {
                    $objDomain->importe = $importe;//$datoscargo[0]['salario'];
                    $objDomain->idgrupoescala = $idgrupoescala;//$datoscargo[0]['idgrupocomplejidad'];
                    $objDomain->idsectorsalarial = $idsector;//0;
                } else if ($tiposalarioescala == 0) {
                    $objDomain->importe = $datoscargo[0]['salario'];
                    $objDomain->idgrupoescala = $datoscargo[0]['idgrupocomplejidad'];
                    $objDomain->idsectorsalarial = 0;
                }
                $objDomain->tiposalarioescala = $tiposalarioescala;
                $objDomain->idescalasueldocargo = $idescalasueldocargo;
                $fecha = split('/', $finicio);
                $objDomain->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objDomain->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objDomain->idcargo = $v;
                $objDomain->save();
            }
        }
        /*$objDomain->save();
        $conn->commit();*/
        return true;
    }

    public function obtenerSalarioEscalaXidcargo($idcargo){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT dc.idcargo, ns.salario
            FROM mod_estructuracomp.dat_cargo dc
            INNER JOIN mod_estructuracomp.nom_salario ns on (dc.idsalario = ns.idsalario)
            WHERE dc.idcargo = $idcargo;";
        $result = $conn->fetchAll($sql);
        return $result[0]['salario'];
    }

    public function sincronizarElementoSalarial($idcargo, $salario){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "UPDATE mod_nomina.conf_elementosalarialcargo 
            SET importe = $salario
            WHERE idcargo = $idcargo;";
        $result = $conn->fetchAll($sql);

    }

    /**
     * Modificar un tipo de nómina.
     *
     * @param int $idtiponomina Identificador del tipo de nómina.
     * @param string $denom Denominacion del tipo de nómina.
     * @param string $finicio Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin Fecha de fin de uso del tipo de nómina.
     * @param string $descrip Descripcion del tipo de nómina.
     */
    public function modificarElementoSalarial($tiposalarioescala, $idelementosalarial, $idsistpago, $idperiodopago, $idgrupoescala, $idsector, $idescalasueldocargo, $importe, $finicio, $ffin, $idcargo)
    {
        //Validar si el Importe que esta en la Base de Datos es igual al Importe que se envia por parametros
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlImporteBD = "SELECT importe 
                  FROM mod_nomina.conf_elementosalarialcargo
				  where idelementosalarialcargo = ?;";
        $importebd = $conn->fetchOne($sqlImporteBD, array($idelementosalarial));
        //Obteniendo el tipo de nómina a modificar.
        $objElemSal = ConfigElementoSalarialCargo::obtenerObjElementoSalarialDadoId($idelementosalarial);
        $datoscargo = ($tiposalarioescala == 0) ? $this->integrator->metadatos->obtenerDatosCargo($idcargo) : null;
        $objElemSal->importe = (!empty($datoscargo)) ? $datoscargo[0]['salario'] : $importe;
        $objElemSal->idgrupoescala = (!empty($datoscargo)) ? $datoscargo[0]['idgrupocomplejidad'] : $idgrupoescala;
        $objElemSal->idsectorsalarial = (!empty($datoscargo)) ? 0 : $idsector;
        $objElemSal->tiposalarioescala = $tiposalarioescala;

        //Modificando los datos del tipo de nómina.
        $objElemSal->idsistemapago = $idsistpago;
        $objElemSal->idperiodopago = $idperiodopago;
        // $objElemSal->idgrupoescala = $datoscargo[0]['idgrupocomplejidad'];
        //$objElemSal->idsectorsalarial = 0;
        $objElemSal->idescalasueldocargo = $idescalasueldocargo;
        //$objElemSal->importe = $datoscargo[0]['salario'];
        $fecha = split('/', $finicio);
        $objElemSal->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $ffin);
        $objElemSal->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $objElemSal->idcargo = $idcargo;

        //Guardando los datos.
        $objElemSal->save();
        $idelementosalarialcargo = $objElemSal->idelementosalarialcargo;
        //Si el importe de la base de datos es diferente al importe que se envia por parametros se salva el cambio en la tabla  dat_cambiosescalaspersonacargoconceptospd
        if($idelementosalarialcargo){
            if($importebd){
                if($importebd != $importe){
                    $arrpersonascargo = DatCargosOcupados::obtenerPersonasxCargo($idcargo);
                    foreach ($arrpersonascargo as $rpersc){
                        $idpersona = $rpersc['idpersona'];
                        $sqlInsertDatCambiosEscalasPersonaCargoConceptospd = "
                            INSERT INTO 
                              mod_nomina.dat_cambiosescalaspersonacargoconceptospd (idpersona, idcargo)
                            VALUES (?, ?);";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $conn->execute($sqlInsertDatCambiosEscalasPersonaCargoConceptospd, array($idpersona, $idcargo));
                    }
                }
            }
        }
    }

    /**
     * Eliminar un tipo de nómina.
     *
     * @param int $idtiponomina Identificador del tipo de nómina.
     */
    public function eliminarElementoSalarial($idelementosalarial)
    {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('ConfigElementoSalarialCargo')
                ->where('idelementosalarialcargo = ?', $idelementosalarial)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                return 2;
            } else {
                return 1;
            }
        }
    }

    /* Busca la configuracion de elementos salariales al cargo y persona para el reporte de registro de trabajadores

     * Ing. Yadir Martinez Vergara
     * 29/06/2017
     *      */

    public function cargarElementosSalarialesalCargoyPersona($idestructura, $arrIdsPersonas, $arrayconceptospd)
    {
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            /* Busco los ids cargos ocupados de las personas en la estructura seleccionada */
            $objCO = new DatCargosOcupados();
            $arrCO = $objCO->obtenerCargosOcupadosPorPersonayEntidad($idestructura, $arrIdsPersonas);
            $arrIdsCO = array();
            foreach ($arrCO as $co)
            {
                $arrIdsCO[] = $co['idcargosocupados'];
            }

            if (empty($arrIdsCO))
            {
                return array();
            }

            $sql = "SELECT dco.idcargosocupados, dco.idpersona, e1.idsistemapago, e1.idperiodopago, e2.idconceptopercepciondescuento, 
                e2.idtarifa, e3.idescalatarifa as idescalatarifacargo, e4.idescalatarifa as idescalatarifapersona
                FROM mod_nomina.dat_cargosocupados dco
              INNER JOIN mod_nomina.conf_elementosalarialcargo e1 ON (e1.idcargo = dco.idcargo)
              INNER JOIN mod_nomina.conf_conceptospdelementossalariales e2 
                ON (e2.idelementosalarialcargo = e1.idelementosalarialcargo 
                    AND (e2.fechafin IS NULL OR e2.fechafin >= now()))
              LEFT JOIN mod_nomina.conf_escalaelementosalarial e3 
                ON (e3.idconfconceptospdelementossalariales = e2.idconfconceptospdelementossalariales 
                    AND (e3.fechafin IS NULL OR e3.fechafin >= now()))
              LEFT JOIN mod_nomina.conf_escalaelementosalarialpersona e4 
                ON (e4.idconfconceptospdelementossalariales = e2.idconfconceptospdelementossalariales
                    AND e4.idpersona = dco.idpersona AND (e4.fechafin IS NULL OR e4.fechafin >= now()))
              WHERE (e1.fechafin IS NULL OR e1.fechafin >= now()) 
                AND dco.idcargosocupados 
                    IN (" . implode(',', $arrIdsCO) . ") AND e2.idconceptopercepciondescuento IN ("
                . implode(',', $arrayconceptospd) . ");";// AND dco.idsituacionlaboral IS NULL

            $arrES = $conn->fetchAll($sql);

            $arrElemSal = array();

            foreach ($arrES as $e)
            {
                if (!empty($e['idescalatarifacargo']) || !empty($e['idescalatarifapersona']))
                {
                    $arrElemSal[$e['idpersona']]->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifacargo = $e['idescalatarifacargo'];

                    $arrElemSal[$e['idpersona']]->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifapersona = $e['idescalatarifapersona'];
                }
            }

            /* Busco la configuracion de los conceptos de pd */
            $sql = "SELECT cpd.idconceptopercepciondescuento, cpdt.idconceptopdtarifa, cpdt.idformacalculo, cpdt.importe
                  FROM mod_nomina.nom_conceptopercepciondescuento cpd
                  INNER JOIN mod_nomina.nom_conceptopdtarifa cpdt 
                    ON (cpdt.idconceptopercepciondescuento = cpd.idconceptopercepciondescuento)
                WHERE (cpd.fechafin IS NULL OR cpd.fechafin >= now()) AND cpdt.idformacalculo IN (1,3) AND 
                cpd.idconceptopercepciondescuento IN (" . implode(',', $arrayconceptospd) . ");";

            $arrCPD = $conn->fetchAll($sql);
            $arrConceptosPD = array();
            $arrCPDEscalas = array();
            foreach ($arrCPD as $c)
            {
                if ($c['idformacalculo'] == 3)
                {
                    $arrCPDEscalas[] = $c['idconceptopdtarifa'];
                }
                $arrConceptosPD[$c['idconceptopercepciondescuento']] = $c;
            }
            /* Busco la estructura escalar de cada concepto que se calcula mediante una escala */
            $sqlEstEscala = "SELECT idestructuraescalar, denominacion, idtipocampo, idnomencladorreferencia, 
                            idconceptopdtarifa, nivel, idtipoentrada, idconfreportescertificaciones, 
                            idvariablesconfreportescertificaciones
                       FROM mod_nomina.nom_estructuraescalar WHERE idconceptopdtarifa IN ("
                . implode(',', $arrCPDEscalas) . ") ;";

            $arrEstEscalar = $conn->fetchAll($sqlEstEscala);

            /* Busco todos los conceptos PD que tienen estructura escalar 3 y 4 nada mas para hacer el calculo */
            $arrconceptopdtarifa = array();
            $arrestructuraescalar = array();
            $arrEER = array();
            $arrIdsEEReporte = array();
            foreach ($arrCPD as &$c)
            {
                if ($c['idformacalculo'] == 3)
                {
                    $escalacalculable = -1;
                    foreach ($arrEstEscalar as $ee)
                    {
                        if ($ee['idconceptopdtarifa'] == $c['idconceptopdtarifa'] && ($ee['idtipoentrada'] == 2))
                        {
                            break;
                        }
                        if ($ee['idconceptopdtarifa'] == $c['idconceptopdtarifa'] && $ee['idtipoentrada'] == 1 && $ee['nivel'] == 1)
                        {
                            $arrEER[] = $ee;
                            $arrIdsEEReporte[] = $ee['idestructuraescalar'];
                            break;
                        }
                        if ($ee['idconceptopdtarifa'] == $c['idconceptopdtarifa'] && ($ee['idtipoentrada'] == 3 || $ee['idtipoentrada'] == 4) && $ee['nivel'] == 1)
                        {
                            $escalacalculable = $ee;
                            break;
                        }
                    }
                    if ($escalacalculable != -1)
                    {
                        $arrconceptopdtarifa[] = $ee['idconceptopdtarifa'];
                        $arrestructuraescalar[] = $ee['idestructuraescalar'];
                    }
                }
            }

            /* Busco los valores de las escalar que se van a calcular a la persona o al cargo */
            $sqlEscala = "SELECT idescalatarifa, importe, idconceptopdtarifa, idestructuraescalar
                       FROM mod_nomina.nom_escalatarifa WHERE idconceptopdtarifa IN ("
                . implode(',', $arrconceptopdtarifa) . ") AND idestructuraescalar IN (" . implode(',', $arrestructuraescalar) . ");";

            $arrVE = $conn->fetchAll($sqlEscala);
            $arrValoresEscalas = array();
            foreach ($arrVE as $ve)
            {
                $arrValoresEscalas[$ve['idescalatarifa']] = $ve['importe'];
            }

            /* Calculo los valores de los conceptos por persona para entradas 3 y 4 */
            $arrValores = array();
            foreach ($arrIdsPersonas as $idp)
            {
                if (array_key_exists($idp, $arrElemSal))
                {
                    $arrValores[$idp] = array();
                    foreach ($arrayconceptospd as $cpd)
                    {
                        if (array_key_exists($cpd, $arrElemSal[$idp]->conceptopd))
                        {
                            if ($arrConceptosPD[$cpd]['idformacalculo'] == 1)
                            {/* Conceptos con importe fijo */
                                $arrValores[$idp][$cpd] = $arrConceptosPD[$cpd]['importe'];
                            } else
                            {/* Conceptos con escalas al cargo o a la persona */
                                $idescalatarifa = -1;
                                if (!empty($arrElemSal[$idp]->conceptopd[$cpd]->idescalatarifapersona))
                                {
                                    $idescalatarifa = $arrElemSal[$idp]->conceptopd[$cpd]->idescalatarifapersona;
                                } else
                                {
                                    $idescalatarifa = $arrElemSal[$idp]->conceptopd[$cpd]->idescalatarifacargo;
                                }

                                if (array_key_exists($idescalatarifa, $arrValoresEscalas))
                                {
                                    $arrValores[$idp][$cpd] = $arrValoresEscalas[$idescalatarifa];
                                } else
                                {
                                    $arrValores[$idp][$cpd] = 0;
                                }
                            }
                        } else
                        {
                            $arrValores[$idp][$cpd] = 0;
                        }
                    }
                }
            }
            if (!empty($arrIdsEEReporte))
            {
                /* Busco los valores de las escalar que se van a calcular por reportes */
                $sql = "SELECT * FROM mod_nomina.nom_escalatarifa "
                    . "WHERE idestructuraescalar IN (" . implode(',', $arrIdsEEReporte) . ");";

                $arrValoresEscalasReportes = $conn->fetchAll($sql);

                foreach ($arrEER as $eer)
                {
                    /* Busco por cada estructura los valores del ultimo reporte */
                    $sql = "SELECT der.idelemento as idpersona, dver.valor
                FROM mod_nomina.dat_reportescertificaciones dr
                INNER JOIN mod_nomina.dat_elementosreportescertificaciones der ON (der.idreportescertificaciones = dr.idreportescertificaciones)
                INNER JOIN mod_nomina.dat_variableselementosreportescertificaciones dver 
                ON (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones AND dver.idvariablesconfreportescertificaciones = {$eer['idvariablesconfreportescertificaciones']})
                WHERE dr.identidad = {$idestructura} AND dr.idconfreportescertificaciones = {$eer['idconfreportescertificaciones']} 
                AND dr.fechainicio = (select MAX(dr1.fechainicio) from mod_nomina.dat_reportescertificaciones dr1 
                WHERE dr1.identidad = {$idestructura} AND dr1.idconfreportescertificaciones = {$eer['idconfreportescertificaciones']} LIMIT 1);";
                    $arrRP = $conn->fetchAll($sql);
                    $arrPersonasReporte = array();
                    foreach ($arrRP as $rp)
                    {
                        $arrPersonasReporte[$rp['idpersona']] = $rp['valor'];
                    }

                    foreach ($arrConceptosPD as &$ac)
                    {
                        if ($ac['idconceptopdtarifa'] == $eer['idconceptopdtarifa'])
                        {
                            $ac['reporte'] = $arrPersonasReporte;
                        }
                    }
                }

                /* Calculo los valores de los conceptos por persona para entrada 1 - Reportes */
                foreach ($arrIdsPersonas as $idp)
                {
                    if (array_key_exists($idp, $arrElemSal))
                    {
                        foreach ($arrayconceptospd as $cpd)
                        {
                            if (array_key_exists($cpd, $arrElemSal[$idp]->conceptopd))
                            {
                                if (array_key_exists('reporte', $arrConceptosPD[$cpd]))
                                {
                                    $idescalatarifa = -1;
                                    if (!empty($arrElemSal[$idp]->conceptopd[$cpd]->idescalatarifapersona))
                                    {
                                        $idescalatarifa = $arrElemSal[$idp]->conceptopd[$cpd]->idescalatarifapersona;
                                    } else
                                    {
                                        $idescalatarifa = $arrElemSal[$idp]->conceptopd[$cpd]->idescalatarifacargo;
                                    }

                                    /* Si existe una escala configurada busco los datos en el reporte */
                                    if ($idescalatarifa != -1)
                                    {
                                        if (array_key_exists($idp, $arrConceptosPD[$cpd]['reporte']))
                                        {
                                            $arrValores[$idp][$cpd] = $this->buscarValoresEscalaReportes($idescalatarifa, $arrConceptosPD[$cpd]['reporte'][$idp], $arrValoresEscalasReportes);
                                        } else
                                        {
                                            $arrValores[$idp][$cpd] = 0;
                                        }
                                    } else
                                    {
                                        $arrValores[$idp][$cpd] = 0;
                                    }
                                }
                            } else
                            {
                                $arrValores[$idp][$cpd] = 0;
                            }
                        }
                    }
                }
            }

            return $arrValores;
        }  catch (Exception $e) {
            return array();
        }
    }

    private function buscarValoresEscalaReportes($idpadre, $valor, &$arrValoresEscalasReportes)
    {
        $importe = 0;
        foreach ($arrValoresEscalasReportes as $v)
        {
            if ($v['idpadre'] == $idpadre)
            {
                switch ($v['idoperadorcomparacion'])
                {
                    case 1:
                        {
                            if ($valor == $v['valorinicial'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                    case 2:
                        {
                            if ($valor < $v['valorinicial'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                    case 3:
                        {
                            if ($valor > $v['valorinicial'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                    case 4:
                        {
                            if ($valor >= $v['valorinicial'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                    case 5:
                        {
                            if ($valor <= $v['valorinicial'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                    case 6:
                        {
                            if ($valor >= $v['valorinicial'] && $valor <= $v['valorfinal'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                    case 7:
                        {
                            if ($valor > $v['valorinicial'] && $valor < $v['valorfinal'])
                            {
                                return $v['importe'];
                            }
                            break;
                        }
                }
            }
        }

        return $importe;
    }

}
