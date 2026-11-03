<?php

/**
 * Modelo de negocio para gestionar las plantillas nominales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses ConfPlantillaNominal, Entidad plantilla nominal (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class GestPlantillaNominalModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function GestPlantillaNominalModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las plantillas nominales dado un identificador de entidad.
     * 
     * @param int $identidad  	Identificador de la entidad.
     * @return array Listado de plantillas nominales.
     */
    public function obtenerListadoPlantillaNominal($identidad, $textobuscar) {

	    if($textobuscar == ''){
		  //Retornando el listado de plantillas nominales.
          return ConfPlantillaNominal::obtenerListadoPlantillasNominales($identidad);
        }else{
		  //Retornando la plantilla nominal buscada.
          return ConfPlantillaNominal::buscarPlantillNominal($identidad, $textobuscar);
		}
	}

    /**
     * Insertar una plantilla nominal.
     * 
     * @param string $denom     	Denominacion del sistema de pago.
     * @param string $finicio   	Fecha de inicio de creacion del sistema de pago.
     * @param string $ffin      	Fecha de fin de uso del sistema de pago.
     * @param string $descrip   	Descripcion del sistema de pago.
     * @param string $identidad    	Identificador de la entidad.
     */
    public function adicionarPlantillaNominal($denom, $finicio, $ffin, $descrip, $identidad, $codigo, $area,$orden, $idcentrocosto) {

        //Se crea el objeto de la plantilla nominal.
        $objPlantillaN = new ConfPlantillaNominal();
		
		$existe = $objPlantillaN->verifyExistPlantilla($identidad,$denom);
		if(!$existe){
        //Insertando los datos de la plantilla nominal.
        $objPlantillaN->denominacion = $denom;
        $fecha=split('/',$finicio); 
        $objPlantillaN->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objPlantillaN->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objPlantillaN->descripcion = $descrip;
        $objPlantillaN->identidad = $identidad;
        //$objPlantillaN->codigo = $codigo;
        //$objPlantillaN->idarea = $area;
        $objPlantillaN->orden = $orden;
        $objPlantillaN->idcentrocosto = is_numeric($idcentrocosto)?$idcentrocosto:null;
        //Guardando los datos.
        $id = $objPlantillaN->save();

        return $id;
		}else{
		return 'existe';
		}
    }

    /**
     * Modificar una plantilla nominal.
     * 
     * @param int $idplantilla    	Identificador de la plantilla.
     * @param string $denom     	Denominacion del sistema de pago.
     * @param string $finicio   	Fecha de inicio de creacion del sistema de pago.
     * @param string $ffin      	Fecha de fin de uso del sistema de pago.
     * @param string $descrip   	Descripcion del sistema de pago.
     */
    public function modificarPlantillaNominal($idplantilla, $denom, $finicio, $ffin, $descrip, $codigo, $area,$orden, $idcentrocosto) {

        //Obteniendo la plantilla nominal a modificar.
        $objPlantillaN = ConfPlantillaNominal::obtenerObjPlantillaNominalDadoId($idplantilla);

        //Modificando los datos de la plantilla nominal.
        $objPlantillaN->denominacion = $denom;
        $fecha=split('/',$finicio); 
        $objPlantillaN->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objPlantillaN->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objPlantillaN->descripcion = $descrip;
        //$objPlantillaN->codigo = $codigo;
		//$objPlantillaN->idarea = $area;
        $objPlantillaN->orden = $orden;
        $objPlantillaN->idcentrocosto = is_numeric($idcentrocosto)?$idcentrocosto:null;

        //Guardando los datos.
        $objPlantillaN->save();
    }

    /**
     * Eliminar una plantilla nominal.
     * 
     * @param int $idplantilla    Identificador de la plantilla nominal.
     */
    public function eliminarPlantillaNominal($idplantilla) {
		/*
        //Obteniendo la plantilla nominal a modificar.
        $objPlantillaN = ConfPlantillaNominal::obtenerObjPlantillaNominalDadoId($idplantilla);

        //Borrando la plantilla nominal.
        $objPlantillaN->delete();*/
		try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('ConfPlantillaNominal')
				->where('idplantillanominal = ?', $idplantilla)
				->execute();
			return $r;
		}catch (Exception $e){
		    if($e->getCode() == 23503){//Code for foreignKeyViolation
                return 2;
            }else{
                return 1;
            }
        }
    }
}