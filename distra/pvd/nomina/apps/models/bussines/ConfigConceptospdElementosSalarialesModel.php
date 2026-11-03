<?php

/**
 * Modelo de negocio para gestionar las configuraciones de los conceptos de pd.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfigConceptospdElementosSalarialesModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfigConceptospdElementosSalarialesModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfigConceptospdElementosSalarialesModel()
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
    public function obtenerListadoConceptospdElementosSalariales($inicio = 0, $limite = 10)
    {
        //Retornando el listado de tipos de nómina.
        return ConfigConceptospdElementosSalariales::obtenerListadoConceptospdElementosSalariales($inicio, $limite);
    }

    public function Obteneridconfconceptospdelementossalariales($idconceptopercepciondescuento, $idelementoSalarialcargo)
    {
        $i = 0;
        foreach ($idelementoSalarialcargo as $k => $v) {
            $aux = ConfigConceptospdElementosSalariales::Obteneridconfconceptospdelementossalariales($idconceptopercepciondescuento, $v);
            if (count($aux) > 0) {
                $arreglo[$i]['idconfconceptospdelementossalariales'] = $aux[0]['idconfconceptospdelementossalariales'];
                $arreglo[$i]['idelementosalarialcargo'] = $aux[0]['idelementosalarialcargo'];
                $i++;
            }

        }

        return $arreglo;
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerConceptosxElementoSalCargo($idelementoSalarialcargo, $tipo, $textoabuscar,$start,$limit)
    {
        if (empty($textoabuscar)) {
            return ConfigConceptospdElementosSalariales::obtenerConceptospdElementoSalarialxElementoSalCargo($idelementoSalarialcargo, $tipo,$start,$limit);
        } else {
            return ConfigConceptospdElementosSalariales::obtenerBusquedaConceptospdElementoSalarialxElementoSalCargo($idelementoSalarialcargo, $tipo, $textoabuscar,$start,$limit);
        }
    }

    public function cantConceptosxElementosAlCargo($idelementoSalarialcargo, $tipo, $textoabuscar)
    {
        if (empty($textoabuscar)) {
            return ConfigConceptospdElementosSalariales::cantConceptospdElementoSalarialxElementoSalCargo($idelementoSalarialcargo, $tipo);
        } else {
            return ConfigConceptospdElementosSalariales::cantBusquedaConceptospdElementoSalarialxElementoSalCargo($idelementoSalarialcargo, $tipo, $textoabuscar);
        } 
    }


    /**
     * Obtener la cantidad total de tipos de nómina.
     *
     * @return int Cantidad total de tipos de nómina.
     */
    public function obtenerCantidadTotalConceptosxElementoSalCargo($idelementoSalarialcargo)
    {
        //Retornando la cantidad total de tipos de nómina.
        return ConfigConceptospdElementosSalariales::obtenerCantidadTotalConceptospdElementoSalarialxElementoSalCargo($idelementoSalarialcargo);
    }

    /**
     * Insertar un tipo de nómina.
     *
     * @param string $denom Denominacion del tipo de nómina.
     * @param string $finicio Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin Fecha de fin de uso del tipo de nómina.
     * @param string $descrip Descripcion del tipo de nómina.
     */
    public function adicionarConceptospdElementosSalariales($idconcepto, $idtarifa, $fechainicio, $fechafin,
                                                            $tipo, $idelementoSalarialcargo, $idelemSalarialpersona, $idelemSalarialcargoocupado, $todoscargos)
    {
        $this->obtenerDatosPagosAdicionalesCargo();

        $objDomainConceptos = new ConfigConceptospdElementosSalariales();
        if ($todoscargos == 1) {
            $objConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
            $arrcargosConElemSalarial = array();
            $idestructura = $this->global->Estructura->idestructura;
            //Obteniendo el array de cargos de la entidad
            $ioc = ZendExt_IoC::getInstance();
            $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);//print_r($arrCargosPorIdEstructura);die;
            $i = 0;
            //Recorriendo el array de cargos de la entidad y buscando si tienen elementos salariales
            foreach ($arrCargosPorIdEstructura as $n => $value) {
                $existeelementosalarial = $objConfigElementoSalarialCargo->existeConfElementoSalarialCargoXIdCargo($value['idcargo']);
                if ($existeelementosalarial == 1) {
                    $arrcargosConElemSalarial[$i] = $objConfigElementoSalarialCargo->obtenerIdElemSalCargo($value['idcargo']);
                    $i++;
                }
            }
            //Aplicandole el concepto a todos los cargos
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $conn->beginTransaction();
            $pos = 0;
            $objDomain = new Doctrine_Collection('ConfigConceptospdElementosSalariales');
            foreach ($arrcargosConElemSalarial as $i => $v) {
                $existe = $objDomainConceptos->existeidConcepto($idconcepto, $v);
                if ($existe == 0) {
                    $objDomain[$pos]->idconceptopercepciondescuento = $idconcepto;
                    $objDomain[$pos]->idtarifa = $idtarifa;
                    $objDomain[$pos]->fechainicio = $fechainicio;
                    $objDomain[$pos]->fechafin = $fechafin;
                    $objDomain[$pos]->tipo = $tipo;
                    $objDomain[$pos]->idelementosalarialcargo = $v;
                    $objDomain[$pos]->idelementosalarialpersona = null;
                    $objDomain[$pos]->idcargosocupados = null;
                    $pos++;
                }
                //print_r($objDomain[$pos]);die;
            }
            $objDomain->save();
            $conn->commit();
            return true;
        } else {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $conn->beginTransaction();
            $pos = 0;
            $objDomain = new Doctrine_Collection('ConfigConceptospdElementosSalariales');
            foreach ($idelementoSalarialcargo as $i => $v) {
                $existe = $objDomainConceptos->existeidConcepto($idconcepto, $v);
                if ($existe == 0) {
                    $objDomain[$pos]->idconceptopercepciondescuento = $idconcepto;
                    $objDomain[$pos]->idtarifa = $idtarifa;
                    $objDomain[$pos]->fechainicio = $fechainicio;
                    $objDomain[$pos]->fechafin = $fechafin;
                    $objDomain[$pos]->tipo = $tipo;
                    $objDomain[$pos]->idelementosalarialcargo = $v;
                    $objDomain[$pos]->idelementosalarialpersona = null;
                    $objDomain[$pos]->idcargosocupados = null;
                    $pos++;
                }
                //print_r($objDomain[$pos]);die;
            }
            $objDomain->save();
            $conn->commit();
            return true;
        }

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
    public function modificarConceptospdElementosSalariales($idconceptoPd, $idconcepto, $idtarifa, $fechainicio, $fechafin,
                                                            $tipo)
    {
        //Obteniendo el tipo de nómina a modificar.
        $objDomain = ConfigConceptospdElementosSalariales::obtenerObjConceptospdElementoSalarialDadoId($idconceptoPd);

        if ($idconcepto == $objDomain->idconceptopercepciondescuento) {
            $objDomain->idconceptopercepciondescuento = $idconcepto;
            $objDomain->idtarifa = $idtarifa;
            $objDomain->fechainicio = $fechainicio;
            $objDomain->fechafin = ($fechafin != null || $fechafin != '')?$fechafin:null;
            $objDomain->tipo = $tipo;

            $objDomain->save();
        } else {
            $objDomainEscala = new ConfEscalaElementoSalarial();
            $objDomainEscalaPersona = new ConfEscalaElementoSalarialPersona();

            $existeEscalaCargo = $objDomainEscala->existeConfEscalaElementoSalarialDadoIdConfConfepto($idconceptoPd);
            if ($existeEscalaCargo == true) {
                $objDomainEscalaDelete = $objDomainEscala->obtenerConfEscalaElementoSalarialDadoIdConfConfepto($idconceptoPd);
                $idescala = $objDomainEscalaDelete[0]['idconfescalaelementosalarial'];
                $objDel = $objDomainEscala->obtenerObjConfEscalaElementoSalarialDadoId($idescala);
                $objDel->delete();
            }
            $existeEscalaPersona = $objDomainEscalaPersona->existeConfEscalaDadoIdConfConfcepto($idconceptoPd);
            if ($existeEscalaPersona == true) {
                $objDomainEscalaPerConcp = $objDomainEscalaPersona->existeConfEscalaDadoIdConfConfcepto($idconceptoPd);
                $idescalapersona = $objDomainEscalaPerConcp[0]['idconfescalaelementosalarialpersona'];
                $objDelPersona = $objDomainEscalaPersona->obtenerObjConfEscalaElementoSalarialDadoId($idescalapersona);
                $objDelPersona->delete();
            }

            $objDomain->idconceptopercepciondescuento = $idconcepto;
            $objDomain->idtarifa = $idtarifa;
            $objDomain->fechainicio = $fechainicio;
            $objDomain->fechafin = ($fechafin != null || $fechafin != '')?$fechafin:null;
            $objDomain->tipo = $tipo;

            $objDomain->save();

        }

    }

    /**
     * Eliminar un tipo de nómina.
     *
     * @param int $idtiponomina Identificador del tipo de nómina.
     */
    public function eliminarConceptospdElementosSalariales($idconceptoPd)
    {
        //try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('ConfigConceptospdElementosSalariales')
                ->where('idconfconceptospdelementossalariales = ?', $idconceptoPd)
                ->execute();
            return $r;
        /*} catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                return 2;
            } else {
                return 1;
            }
        }*/
    }


    public function existeidConceptoArrElementos($idconceptopercepciondescuento, $arrElementosSalariales)
    {
        $flag = 0;
        $varAux = 0;
        $objDomain = new ConfigConceptospdElementosSalariales();
        foreach ($arrElementosSalariales as $k => $v) {
            $varAux = $objDomain->existeidConcepto($idconceptopercepciondescuento, $v);
            if ($varAux == 1) {
                $flag = 1;
                break;
            }
        }
        return $flag;
    }

    /**
     * Servicio que obtiene los pagos adicionales para el reporte de los cargos
     * @autor Tte. Frank Rodriguiguez Berroa
     *
     * @param array $arraycargos
     * @param array $arrayconceptospd
     */
    public function obtenerDatosPagosAdicionalesCargo($arraycargos = array(), $arrayconceptospd = array())
    {
        $arrayfinal = array();
        $objConfElementoSalarialCargo = new ConfigElementoSalarialCargo();
        $objConfConceptosPDCargo = new ConfigConceptospdElementosSalariales();
        $objConfEscalaConceptosPD = new ConfEscalaElementoSalarial();
        $objNomConceptoPD = new NomConceptoPercepcionDescuento();
        // $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);
        //Recorriendo los cargos y los pagos adicionales para obtener la escala de los mismos
        foreach ($arraycargos as $ic => $rc) {
            $arrayfinal[$rc]['idcargo'] = $rc;
            $idelementosarialcargo = $objConfElementoSalarialCargo->obtenerIdElemSalCargo($rc);
            $arrayconceptos = array();
            foreach ($arrayconceptospd as $icpd => $rcpd) {
                $importeescala = 0.00;
                $arrayconceptos[$rcpd]['idconceptopd'] = $rcpd;
                $arrayconceptos[$rcpd]['denominacionconcepto'] = $objNomConceptoPD->obtenerDenomXId($rcpd);
                if (is_numeric($idelementosarialcargo)) {
                    $idconfconceptopd = $objConfConceptosPDCargo->obtenerIdConceptospdElementoSalarialxElementoSalCargoIdConceptoPD($idelementosarialcargo, $rcpd);

                    if (is_numeric($idconfconceptopd)) {
                        if (is_numeric($objConfEscalaConceptosPD->obtenerImporteXIdConfConceptoPD($idconfconceptopd))) {
                            $importeescala = $objConfEscalaConceptosPD->obtenerImporteXIdConfConceptoPD($idconfconceptopd);
                        }
                    }
                }
                $arrayconceptos[$rcpd]['importe'] = number_format($importeescala, 2, '.', '');
            }
            $arrayfinal[$rc]['conceptos'] = $arrayconceptos;
        }
        return $arrayfinal;
    }

}
