<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomFormatoTipoMedioContacto extends BaseNomFormatoTipoMedioContacto
{

    /**
     * Obtiene todos activos
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetTodosActivos()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomFormatoTipoMedioContacto')->where(
                "fechainicio <= 'CURRENT_DATE' or fechafin IS NULL"
            )->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Busca un NomFormatoTipoMedio
     *
     * @param int $idformatotipomediocontacto
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function Buscar($idformatotipomediocontacto)
    {
        try {
            $temp = $this->getTable('NomFormatoTipoMedioContacto')->find($idformatotipomediocontacto);
            return $temp->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene todos los Formatos Tipo Medio
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetTodos()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('*')->from('NomFormatoTipoMedioContacto')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene todos los Formatos Tipo Medio por límites
     *
     * @param int $limite Límite superior
     * @param int $inicio Comienzo inferior
     *
     * @return array
     * @throws Doctrine_Exception
     */
    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomFormatoTipoMedioContacto')->limit($limite)->offset($inicio)->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}//fin clase


