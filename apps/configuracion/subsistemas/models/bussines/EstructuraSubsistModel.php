<?php
/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class EstructuraSubsistModel extends ZendExt_Model
{
/**
 * Constructor de la clase
 */
    public function __construct()
    {
        parent::ZendExt_Model();
    }
/**
 * Insertar estructura del subsistema
 * 
 * @param object $obj Objeto de tipo estructura subsistema
 * @return boolean Retorna verdadero en caso de insertar el dato falso en otro caso
 * @throws Doctrine_Exception $ee
 */
    public function insertarEstructuraSubsist($obj)
    {
        try {
            $busca = DatEstructurasubsist::buscarEstructurasubsist(
                array('idestructura' => $obj->idestructuracomun, 'idsubsistema' => $obj->idsubsistema)
            );
            if ($busca['cant'] == 0) {
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }
/**
 * Eliminar estructura del subsistema
 * 
 * @param type $obj Objeto de tipo estructura subsistema
 * @return boolean Retorna verdadero en caso de eliminar el objeto falso en otro caso
 * @throws Doctrine_Exception $ee
 */
    public function eliminarEstructuraSubsist($obj)
    {
        try {
            $obj->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }
/**
 * Modificar estructura subsistema 
 * 
 * @param object $obj Objeto de tipo estructura subsistema
 * @return boolean Retorna verdadero en caso de modificar el objeto falso en otro caso
 * @throws Doctrine_Exception $ee
 */
    static public function modificarEstructuraSubsist($obj)
    {
        try {
            $estruct = new DatEstructurasubsist();
            $busca = $estruct->BuscarEstructuraSubsist(
                 $obj->idestructuracomun, $obj->idsubsistema
            );    
            if (count($busca) == 1) {
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }
/**
 * Buscar estructura subsistemas
 * 
 * @param int $identidad Identificador de entidad
 * @param int $idsubsistema Identificador de subsistema
 * @return boolean
 * @throws Doctrine_Exception $ee
 */
    public function BuscarEstructurasubsist($identidad, $idsubsistema)
    {
        try {
            $estruct = new DatEstructurasubsist();
            $buscar = $estruct->buscarEstructurasubsist(
                array('idestructura' => $identidad, 'idsubsistema' => $idsubsistema)
            );
            if ($buscar['cant'] == 1) {
                return $buscar['datos'][0];
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }
/**
 * Subsistemas instanceados
 * 
 * @param int $identidad Identificador de entidad
 * @param boolean $instanciado Indica si el subsistema esta instanceado
 * @return array Retorna un arreglo con los subsistemas instanceados
 * @throws Doctine_Exception $ee
 */
    public function SubsistemasInstanceados($identidad, $instanciado = true)
    {
        try {
            $arreglo = array();
            $sub = new DatEstructurasubsist();
            $estruc = new NomSubsistema();
            $lista = $estruc->listarSubsistemas();
            $y = $sub->buscarEstructurasubsist(array('idestructura' => $identidad));
            if ($instanciado) {
                foreach ($lista as $elem) {
                    foreach ($y as $x) {
                        if ($elem->idestructura == $x->idestructura) {
                            $arreglo[] = $elem;
                        }
                    }
                }
            } else {
                foreach ($lista as $elem) {
                    foreach ($y as $x) {
                        if ($elem->idestructura != $x->idestructura) {
                            $arreglo[] = $elem;
                        }
                    }
                }
            }
            return $arreglo;
        } catch (Doctine_Exception $ee) {
            return false;
        }
    }
/**
 * Cerrar subsistema
 * 
 * @param int $identidad Identificador de entidad
 * @param int $idsubsistema Identificador del subsistema
 * @return int Retorna 1 en caso de cerrar el subsistema 0 en caso contrario
 * @throws Doctine_Exception $ee
 */
    static public function cerrarSubsistema($identidad, $idsubsistema)
    {
        try {
            $obj = self::BuscarEstructurasubsist($identidad, $idsubsistema);
            $periodo = $this->pIntegrator->ejercicios->PeriodoSiguiente($obj->periodoactual);
            $obj->periodoactual = $periodo;
            $obj->save();
            return 1;
        } catch (Doctine_Exception $ee) {
            return 0;
        }
    }
/**
 * Actualizar fecha subsistema
 * 
 * @param int $identidad Identificador de entidad
 * @param int $idsubsistema Identificador de subsistema
 * @param object $fecha Objeto de tipo fecha
 * @return int Retorna 1 en caso de actualizar la fecha 0 en otro caso
 * @throws Doctine_Exception $ee
 */
    static public function actualizarFechaSubsistema($identidad, $idsubsistema, $fecha)
    {
        try {
            $obj = self::BuscarEstructurasubsist($identidad, $idsubsistema);
            $obj->fechacontable = $fecha;
            $obj->save();
            return 1;
        } catch (Doctine_Exception $ee) {
            return 0;
        }
    }

   
/**
 * Actualizar Estructura subsistema
 * 
 * @param DatEstructurasubsist $d Objeto de tipo DatEstructurasubsistema
 * @return boolean Retorna verdadero en caso de actualizar
 * @throws Doctrine_Exception $e
 */
    public function Actualizar(DatEstructurasubsist $d)
    {
        try {
            $d->save();
            return true;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    
     /**
     * Verifica si existe el subsistema en una entidad.
     *
     * @param mixed $idmoneda Identificador de moneda
     * @param mixed $estructura Estructura de moneda
     * @param mixed $tipomoneda Tipo de moneda
     *
     * @return int -2 ya existe, -1 no existe
     */
    static public function verificarExisteSubsisteEntidad(
        $identidad, $idsubsistema, $idestado
    )
    {
        $estruct = new DatEstructurasubsist();
            $buscar = $estruct->BuscarEstructuraSubsistEstado(
                 $identidad, $idsubsistema, $idestado
            );
            if (count($buscar) > 0) {
                return -2;
            } else {
                return -1;
            }        
    }
}
