<?php

/**
 * Modelo de negocio para gestionar configuración de los conceptos contables.
 *
 * @author Tte. Frank Rodriguez
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Modelo de negocio
 * @uses ConfigConceptosContablesModel, Entidad valor de configuracion de los conceptos contables (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class ConfigConceptosContablesModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfigConceptosContablesModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar una configuración de conceptos contables.
     *
     * @param int $idtiponom Identificador del tipo de nómina.
     * @param int $idtipopago Identificador del tipo de pago.
     * @param array $arrayCateg Arreglo de categorías.
     */
    public function adicionarConfigConceptosContables($idestructura, $denominacion, $idtiponomina, $idestructuranomina, $fechainicio, $fechafin, $descripcion, $idpartidagasto, $obligacion, $idparrafofiscal, $idclienteproveedorcobropago, $idtienecobrospagos, $idtipocobrospagos,$tipointegracioncobrospagos, $cuentacontable, $liquidacobrosypagos, $idcampoliquidaobligacion)
    {

        //Salvando en ConfigConceptosContables
        $objDomain = new ConfigConceptosContables();
        $denomtiponomina = NomTipoNomina::obtenerDenominacion($idtiponomina);
        $objDomain->denominacion = $denominacion . ' - ' . $denomtiponomina;
        $objDomain->descripcion = $descripcion;
        $objDomain->fdesde = $fechainicio;
        $objDomain->fhasta = $fechafin;
        $objDomain->idtiponomina = $idtiponomina;
        $objDomain->idestructuramodelodomina = $idestructuranomina;
        $objDomain->idparrafofiscal = (is_numeric($idparrafofiscal))?$idparrafofiscal:null;
        $objDomain->idclienteproveedorcobropago = (is_numeric($idclienteproveedorcobropago))?$idclienteproveedorcobropago:null;
        $objDomain->idtienecobrospagos = (is_numeric($idtienecobrospagos))?$idtienecobrospagos:null;
        $objDomain->idtipocobrospagos = (is_numeric($idtipocobrospagos))?$idtipocobrospagos:null;
        $objDomain->idtipointegracioncobrospagos = (is_numeric($tipointegracioncobrospagos))?$tipointegracioncobrospagos:null;
        $objDomain->cuentacontable = (is_numeric($cuentacontable))?$cuentacontable:null;
        $objDomain->liquidacobrosypagos = ($liquidacobrosypagos == "false")?0:1;
        $objDomain->idcampoliquidaobligacion = (is_numeric($idcampoliquidaobligacion))?$idcampoliquidaobligacion:null;
        $objDomain->save();

        //Salvando en ConfigConceptosContablesEntidad
        $obj = new ConfigConceptosContablesEntidad();
        $obj->idestructura = $idestructura;
        $obj->idconceptocontable = $objDomain->idconceptoscontables;
        $obj->obligacion = $obligacion;
        $obj->save();

        //Buscando la el camino de la estructura de la nomina del concepto
        $sqldatosmodelonominaconceptos = "select idconcepto from mod_nomina.dat_datosmodelonominaconceptos
		                                             where idestructuramodelosnomina = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //$datoscc = $conn->fetchAll($sqlCountCC, array($rvdi->centroscosto));
        $idconcepto = $conn->fetchOne($sqldatosmodelonominaconceptos, array($idestructuranomina));
        //Conceptoscontables con el mismo camino en la entidad
        $sqlconceptocontable = "select cc.idconceptoscontables, cce.idconceptocontableentidad from mod_nomina.conf_conceptoscontables cc
                                                     inner join mod_nomina.conf_conceptoscontablesentidad cce on(cce.idconceptocontable = cc.idconceptoscontables)
                                                     inner join mod_nomina.conf_estructuramodelosnomina en on(en.idestructuramodelodomina = cc.idestructuramodelodomina)
                                                     inner join mod_nomina.dat_datosmodelonominaconceptos dmnc on(dmnc.idestructuramodelosnomina = en.idestructuramodelodomina)
		                                             where dmnc.idconcepto = ? and cce.idestructura = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conceptocontable = $conn->fetchAll($sqlconceptocontable, array($idconcepto, $idestructura));
        //Recorriendo los conceptos contables que son del mismo tipo que el modificado
        foreach($conceptocontable as $cc){
            //Salvando la obligacion
            $objConceptoContableEntidad = ConfigConceptosContablesEntidad::obtenerObjConfigConceptosContablesEntidad($cc['idconceptocontableentidad']);
            $objConceptoContableEntidad->obligacion = ($obligacion)?$obligacion:'';
            $objConceptoContableEntidad->save();

        }

        return "ADD";
    }

    /**
     * Modificar una configuración de conceptos contables.
     *
     * @param int $idconf Identificador de la configuración.
     * @param int $idtiponom Identificador del tipo de nómina.
     * @param int $idtipopago Identificador del tipo de pago.
     * @param array $arrayCateg Arreglo de categorías.
     */
    public function modificarConfigConceptosContables($idconceptoscontables, $idestructura, $denominacion, $idtiponomina, $idestructuranomina, $fechainicio, $fechafin, $descripcion, $idpartidagasto, $obligacion, $idparrafofiscal, $idclienteproveedorcobropago, $idtienecobrospagos, $idtipocobrospagos,$tipointegracioncobrospagos, $cuentacontable, $liquidacobrosypagos, $idcampoliquidaobligacion)
    {
        $objDomain = new ConfigConceptosContables();
        $objUpdate = $objDomain->obtenerObjConfigConceptosContables($idconceptoscontables);
        $denomtiponomina = NomTipoNomina::obtenerDenominacion($idtiponomina);
        $objUpdate->denominacion = $denominacion . ' - ' . $denomtiponomina;
        $objUpdate->descripcion = $descripcion;
        $objUpdate->fdesde = $fechainicio;
        $objUpdate->fhasta = $fechafin;
        $objUpdate->idtiponomina = $idtiponomina;
        $objUpdate->idestructuramodelodomina = $idestructuranomina;
        $objUpdate->idparrafofiscal = (is_numeric($idparrafofiscal))?$idparrafofiscal:null;
        $objUpdate->idclienteproveedorcobropago = (is_numeric($idclienteproveedorcobropago))?$idclienteproveedorcobropago:null;
        $objUpdate->idtienecobrospagos = (is_numeric($idtienecobrospagos))?$idtienecobrospagos:null;
        $objUpdate->idtipocobrospagos = (is_numeric($idtipocobrospagos))?$idtipocobrospagos:null;
        $objUpdate->idtipointegracioncobrospagos = (is_numeric($tipointegracioncobrospagos))?$tipointegracioncobrospagos:null;
        $objUpdate->cuentacontable = (is_numeric($cuentacontable))?$cuentacontable:null;
        $objUpdate->liquidacobrosypagos = ($liquidacobrosypagos == "false")?0:1;
        $objUpdate->idcampoliquidaobligacion = (is_numeric($idcampoliquidaobligacion))?$idcampoliquidaobligacion:null;
        $objUpdate->save();

        //Buscando la el camino de la estructura de la nomina del concepto
        $sqldatosmodelonominaconceptos = "select idconcepto from mod_nomina.dat_datosmodelonominaconceptos
		                                             where idestructuramodelosnomina = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //$datoscc = $conn->fetchAll($sqlCountCC, array($rvdi->centroscosto));
        $idconcepto = $conn->fetchOne($sqldatosmodelonominaconceptos, array($idestructuranomina));
        //Conceptoscontables con el mismo camino en la entidad
        $sqlconceptocontable = "select cc.idconceptoscontables, cce.idconceptocontableentidad from mod_nomina.conf_conceptoscontables cc
                                                     inner join mod_nomina.conf_conceptoscontablesentidad cce on(cce.idconceptocontable = cc.idconceptoscontables)
                                                     inner join mod_nomina.conf_estructuramodelosnomina en on(en.idestructuramodelodomina = cc.idestructuramodelodomina)
                                                     inner join mod_nomina.dat_datosmodelonominaconceptos dmnc on(dmnc.idestructuramodelosnomina = en.idestructuramodelodomina)
		                                             where dmnc.idconcepto = ? and cce.idestructura = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conceptocontable = $conn->fetchAll($sqlconceptocontable, array($idconcepto, $idestructura));
        //Recorriendo los conceptos contables que son del mismo tipo que el modificado
        foreach($conceptocontable as $cc){
            //Salvando la obligacion
            $objConceptoContableEntidad = ConfigConceptosContablesEntidad::obtenerObjConfigConceptosContablesEntidad($cc['idconceptocontableentidad']);
            $objConceptoContableEntidad->obligacion = ($obligacion)?$obligacion:'';
            $objConceptoContableEntidad->save();
        }

        return "MOD";

    }

    public function eliminarConfigConceptosContables($identidad, $arridconf)
    {
        $objDomainConCont = new ConfigConceptosContables();
        $objDomainConContEnt = new ConfigConceptosContablesEntidad();
        foreach ($arridconf as $i => $value) {
            $arrconcepcontentidad = $objDomainConContEnt->obtenerListadoConfigConceptosContablesEntidadXIdConceptocontable($value);
            if (count($arrconcepcontentidad) == 1) { //obteniendo todas las tuplas con un mismo idconceptoentidad
                //Eliminando la relacion para el concepto y estructura en cuestion en la tabla ConfigConceptosContablesEntidad
                $conceptoentidad = $objDomainConContEnt->obtenerListadoConfigConceptosContablesEntidadXEstConcepCont($identidad, $value);
                $objConContEntDelete = $objDomainConContEnt->obtenerObjConfigConceptosContablesEntidad($conceptoentidad[0]['idconceptocontableentidad']);
                $objConContEntDelete->delete();
                //Eliminando el concepto en ConfigConceptosContables
                $objConContDelete = $objDomainConCont->obtenerObjConfigConceptosContables($value);
                $objConContDelete->delete();
            } else {
                //Eliminando la relacion para el concepto y estructura en cuestion en la tabla ConfigConceptosContablesEntidad
                $conceptoentidad = $objDomainConContEnt->obtenerListadoConfigConceptosContablesEntidadXEstConcepCont($identidad, $value);
                $objConContEntDelete = $objDomainConContEnt->obtenerObjConfigConceptosContablesEntidad($conceptoentidad[0]['idconceptocontableentidad']);
                $objConContEntDelete->delete();
            }
        }
        return 'DEL';
    }

    public function replicarConceptosContables($arridentidades, $arridconceptos)
    {
        foreach ($arridentidades as $rid) {
            foreach ($arridconceptos as $k => $v) {
                $arrconceptos = ConfigConceptosContablesEntidad::obtenerListadoConfigConceptosContablesEntidadXEstConcepCont($rid, $v['id']);
                //Si el concepto no existe en las entidades
                if (count($arrconceptos) == 0) {
                    $obj = new ConfigConceptosContablesEntidad();
                    $obj->idestructura = $rid;
                    $obj->idconceptocontable = $v['id'];
                    $obj->obligacion = ($v['obligacion'])?$v['obligacion']:'';
                    $obj->save();
                }
            }
        }
        return 'ok';
    }
}