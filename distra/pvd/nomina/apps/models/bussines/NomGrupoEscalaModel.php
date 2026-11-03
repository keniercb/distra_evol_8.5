<?php

/**
 * Modelo de negocio para gestionar los grupos escala.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomGrupoEscala, Entidad grupo escala (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomGrupoEscalaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomGrupoEscalaModel() {
        parent::ZendExt_Model();
    }

	/**
     * Obtener todos los grupos escala.
     * 
	 *
     * @return array Listado de grupos escala
     */
    public function obtenerTodosGruposEscala() {

        //Retornando el listado de grupos escala.
        return NomGrupoEscala::obtenerTodosGruposEscala();
    }
	
    /**
     * Obtener un listado de los datos de los grupos escala.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
	 *
     * @return array Listado de grupos escala
     */
    public function obtenerListadoGruposEscala($inicio = 0, $limite = 10) {

        //Retornando el listado de grupos escala.
        return NomGrupoEscala::obtenerListadoGruposEscala($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de grupos escala.
     *
     * @return int Cantidad total de grupos escala.
     */
    public function obtenerCantidadTotalGruposEscala() {

        //Retornando la cantidad total de grupos escala.
        return NomGrupoEscala::obtenerCantidadTotalGruposEscala();
    }

    /**
     * Insertar un grupo escala.
     * 
     * @param string $denom     Denominacion del grupo escala.
     * @param string $finicio   Fecha de inicio de creacion del grupo escala.
     * @param string $ffin      Fecha de fin de uso del grupo escala.
     * @param string $descrip   Descripcion del grupo escala.
     */
    public function adicionarGrupoEscala($denom, $finicio, $ffin, $descrip) {


        try {
            if(!NomGrupoEscala::findByIdOrDenom($denom)){

                //Se crea el objeto del grupo escala.
                $objGrupoE = new NomGrupoEscala();

                //Insertando los datos del grupo escala.
                $objGrupoE->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objGrupoE->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objGrupoE->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objGrupoE->descripcion = $descrip;

                //Guardando los datos.
                $objGrupoE->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar un grupo escala.
     * 
     * @param int $idgrupoescala   Identificador del grupo escala.
     * @param string $denom     Denominacion del grupo escala.
     * @param string $finicio   Fecha de inicio de creacion del grupo escala.
     * @param string $ffin      Fecha de fin de uso del grupo escala.
     * @param string $descrip   Descripcion del grupo escala.
     */
    public function modificarGrupoEscala($idgrupoescala, $denom, $finicio, $ffin, $descrip) {



        try {
            if(!NomGrupoEscala::findByIdOrDenom($denom,$idgrupoescala)){
                //Obteniendo el grupo escala. a modificar.
                $objGrupoE = NomGrupoEscala::obtenerObjGrupoEscalaDadoId($idgrupoescala);

                //Modificando los datos del grupo escala.
                $objGrupoE->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objGrupoE->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objGrupoE->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objGrupoE->descripcion = $descrip;

                //Guardando los datos.
                $objGrupoE->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un grupo escala.
     * 
     * @param int $idgrupoescala    Identificador del grupo escala.
     */
    public function eliminarGrupoEscala($idgrupoescala) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomGrupoEscala')
				->where('idgrupoescala = ?', $idgrupoescala)
				->execute();
			return $r;
		} catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                return 2;
            }else{
                return 1;
            }
        }
    }
}
