<?php
 
/**
 * Modelo de negocio para gestionar las escalas de los elementos salariales al cargo.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses ConfEscalaElementoSalarialModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfEscalaElementoSalarialModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfEscalaElementoSalarialModel() {
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
        return ConfEscalaElementoSalarial::obtenerListadoConfEscalaElementoSalarial();
    }
    
    public function existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales) {
		
        //Retornando el listado de estructuras escalares.
        return ConfEscalaElementoSalarial::existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales);
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
     */
    
    public function adicionarEscalaXConcepto($idestructuraescalar, $idconfconceptospdelementossalariales,
        $importe, $fechainicio, $fechafin){
            $objEscConf = new ConfEscalaElementoSalarial();
            //Insertando los datos de la escala tarifa.

            $objEscConf->idescalatarifa = ($idestructuraescalar)? $idestructuraescalar : null;
            $objEscConf->idconfconceptospdelementossalariales = ($idconfconceptospdelementossalariales)? $idconfconceptospdelementossalariales : null;
            $objEscConf->importe = ($importe)? $importe : null;
            $objEscConf->fechainicio = ($fechainicio)? $fechainicio : null;
            $objEscConf->fechafin = ($fechafin)? $fechafin : null;
            //Guardando los datos.
            //print_r($objEscConcepto);die;
            $objEscConf->save();


        return true;
        
    }

    /**
     * Modificar un tipo de n�mina.
     * 
     * @param int $idtiponomina   Identificador del tipo de n�mina.
     * @param string $denom     Denominacion del tipo de n�mina.
     * @param string $finicio   Fecha de inicio de creacion del tipo de n�mina.
     * @param string $ffin      Fecha de fin de uso del tipo de n�mina.
     * @param string $descrip   Descripcion del tipo de n�mina.
     */
    public function modificarEscalaXConcepto($existeidconfconceptospdelementossalariales,$idconfescalaelementosalarial, $idestructuraescalar, $idconfconceptospdelementossalariales,
        $importe, $fechainicio, $fechafin) {

       // print_r($existeidconfconceptospdelementossalariales);die;
        //$objEscConf = $objEscConcepto->obtenerObjConfEscalaElementoSalarialDadoId($idconfescalaelementosalarial);
        foreach($existeidconfconceptospdelementossalariales as $k=>$v){
            $idconfconceptospdelementossalariales = $v['idconfconceptospdelementossalariales'];
            $idelementoSalarialcargo = $v['idelementosalarialcargo'];
          //  $objEscConcepto = new ConfEscalaElementoSalarial();
            $EscConf =ConfEscalaElementoSalarial::Buscarid($idconfconceptospdelementossalariales);

            //Validar si el Importe que esta en la Base de Datos es igual al Importe que se envia por parametros
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sqlImporteBD = "SELECT importe 
                  FROM mod_nomina.conf_escalaelementosalarial
				  where idconfescalaelementosalarial = ?;";
            $importebd = $conn->fetchOne($sqlImporteBD, array($EscConf[0]['idconfescalaelementosalarial']));
           // print_r($objEscConf);die;
            $objEscConf = ConfEscalaElementoSalarial::obtenerObjConfEscalaElementoSalarialDadoId($EscConf[0]['idconfescalaelementosalarial']);
            $objEscConf->idescalatarifa = ($idestructuraescalar)? $idestructuraescalar : null;
            $objEscConf->idconfconceptospdelementossalariales = ($idconfconceptospdelementossalariales)? $idconfconceptospdelementossalariales : null;
            $objEscConf->importe = ($importe)? $importe : null;
            $objEscConf->fechainicio = ($fechainicio)? $fechainicio : null;
            $objEscConf->fechafin = ($fechafin)? $fechafin : null;

            //Guardando los datos.
            $objEscConf->save();
            $idconfescalaelementosalarial = $objEscConf->idconfescalaelementosalarial;
            //Si el importe de la base de datos es diferente al importe que se envia por parametros se salva el cambio en la tabla  dat_cambiosescalaspersonacargoconceptospd
            if($idconfescalaelementosalarial){
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
        }

        return true;
     }

    /**
     * Eliminar un tipo de n�mina.
     * 
     * @param int $idtiponomina    Identificador del tipo de n�mina.
     */
    public function eliminarEscalaXConcepto($existeidconfconceptospdelementossalariales,$idescalaelemsal) {

        //Obteniendo el tipo de n�mina a eliminar.
        foreach($existeidconfconceptospdelementossalariales as $k=>$v){
            $EscConf =ConfEscalaElementoSalarial::Buscarid($v['idconfconceptospdelementossalariales']);
            $objEscConf = ConfEscalaElementoSalarial::obtenerObjConfEscalaElementoSalarialDadoId($EscConf[0]['idconfescalaelementosalarial']);
            //Borrando el tipo de n�mina.
            $objEscConf->delete();
        }

    }
}
