<?php

/**
 * Modelo de negocio para gestionar las configuraciones a las escalas de la situacion del servicio.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfEscalaElementoSalarialPersonaModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfEscalaElementoSalarialPersonaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfEscalaElementoSalarialPersonaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las estructuras escalares dado un identificador de la tarifa de concepto.
     * 
     * @param int $idconceptotarifa  Identificador de la tarifa del concepto.
     * @return array Listado de estructuras escalares
     */
    public function obtenerListadoConfEscalaElementoSalarial() {
		
        //Retornando el listado de estructuras escalares.
        return ConfEscalaElementoSalarialPersona::obtenerListadoConfEscalaElementoSalarial();
    }
    
    public function existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales, $idcargosocupados) {
		
        //Retornando el listado de estructuras escalares.
        return ConfEscalaElementoSalarialPersona::existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales, $idcargosocupados);
    }

    /**
     * Insertar una estructura escalar.
     * 
     * @param string $denominacion     	  		Denominaci�n de la estructura escalar.
	 * @param int $idtipocampo      	   		Identificador del tipo de campo.
	 * @param int $idnomenclador     			Identificador del nomenclador de referencia.
	 * @param int $nivel     	   				Nivel de la estructura escalar.
     * @param int $idtipoentrada     			Identificador del tipo de entrada.
	 * @param int $idreporte     				Identificador del tipo de reporte.
	 * @param int $idvarreporte     			Identificador de la variable del tipo de reporte.
	 * @param int $idconceptotarifa     		Identificador de la tarifa de concepto.
	 * @param int $idcargosocupados     		Identificador de cargos ocupados.
     */
    
    public function adicionarEscalaXConcepto($idestructuraescalar, $idconfconceptospdelementossalariales,
        $importe, $fechainicio, $fechafin, $idcargosocupados){
		$objEscConf = new ConfEscalaElementoSalarialPersona();
        //Insertando los datos de la escala tarifa.

		$objEscConf->idescalatarifa = ($idestructuraescalar)? $idestructuraescalar : null;
        $objEscConf->idconfconceptospdelementossalariales = ($idconfconceptospdelementossalariales)? $idconfconceptospdelementossalariales : null;
		$objEscConf->importe = ($importe)?$importe : 0.00;
		$objEscConf->fechainicio = ($fechainicio)? $fechainicio : null;
		$objEscConf->fechafin = ($fechafin)? $fechafin : null;
                $objEscConf->idcargosocupados = null;
                $objB = new DatCargosOcupados();
                $idpersona = $objB->obtenerIdPersonaXIdCargoOcupado($idcargosocupados);
		$objEscConf->idpersona = $idpersona;
		//Guardando los datos.
		$objEscConf->save();
        return true;
        
    }

    /**
     * Modificar un tipo de nómina.
     * 
     * @param int $idtiponomina   Identificador del tipo de nómina.
     * @param string $denom     Denominacion del tipo de nómina.
     * @param string $finicio   Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin      Fecha de fin de uso del tipo de nómina.
     * @param string $descrip   Descripcion del tipo de nómina.
     */
    public function modificarEscalaXConcepto($idconfescalaelementosalarial, $idestructuraescalar, $idconfconceptospdelementossalariales,
        $importe, $fechainicio, $fechafin, $idcargosocupad, $idelementoSalarialcargo = null) {
        //Validar si el Importe que esta en la Base de Datos es igual al Importe que se envia por parametros
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlImporteBD = "SELECT importe 
                  FROM mod_nomina.conf_escalaelementosalarialpersona
				  where idconfescalaelementosalarialpersona = ?;";
        $importebd = $conn->fetchOne($sqlImporteBD, array($idconfescalaelementosalarial));

        $objEscConcepto = new ConfEscalaElementoSalarialPersona();
        $objEscConf = $objEscConcepto->obtenerObjConfEscalaElementoSalarialDadoId($idconfescalaelementosalarial);
        
        $objEscConf->idescalatarifa = ($idestructuraescalar)? $idestructuraescalar : null;
        $objEscConf->idconfconceptospdelementossalariales = ($idconfconceptospdelementossalariales)? $idconfconceptospdelementossalariales : null;
		$objEscConf->importe = ($importe)? $importe : null;
		$objEscConf->fechainicio = ($fechainicio)? $fechainicio : null;
		$objEscConf->fechafin = ($fechafin)? $fechafin : null;
		
		//Guardando los datos.
		$objEscConf->save();
		$idconfescalaelementosalarialpersona = $objEscConf->idconfescalaelementosalarialpersona;
        //Si el importe de la base de datos es diferente al importe que se envia por parametros se salva el cambio en la tabla  dat_cambiosescalaspersonacargoconceptospd
        if($idconfescalaelementosalarialpersona){
            if($importebd){
                if($importebd != $importe){
                    $idcargo = ConfigElementoSalarialCargo::obtenerIdCargoXIdElementoSalarial($idelementoSalarialcargo);
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
        return true;
     }

    /**
     * Eliminar un tipo de nómina.
     * 
     * @param int $idtiponomina    Identificador del tipo de nómina.
     */
    public function eliminarEscalaXConcepto($idescalaelemsal) {

        //Obteniendo el tipo de nómina a eliminar.
        $objEscConf = ConfEscalaElementoSalarialPersona::obtenerObjConfEscalaElementoSalarialDadoId($idescalaelemsal);
        //Borrando el tipo de nómina.
        $objEscConf->delete();
    }
}
