<?php

/**
 * Clase dominio <b>Tipos de Tasas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class NomTipotasas extends BaseNomTipotasas
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasMany(
            'DatTasa', array('local' => 'idtipotasa', 'foreign' => 'idtipotasa')
        );
        parent::setUp();
    }

    /**
     * Busca una tasa.
     *
     * @param array $cond  Condiciones
     * @param int   $limit Límite
     * @param int   $start Inicio
     *
     * @return mixed Cantidad y datos de la tasa o "false" si no la encuentra
     */
    public function buscar($cond = array(), $limit = 10, $start = 0)
    {
        try {
            $filter = " 0=0 ";
            if ($cond['idtipotasa']) {
                $filter .= " and e.idtipotasa = '" . $cond['idtipotasa'] . "'";
            }
            if ($cond['nombretipotasa'] || $cond['nombre']) {
                $nombre = $cond['nombretipotasa'] ? $cond['nombretipotasa'] : $cond['nombre'];
                $filter .= " and e.nombretipotasa ILIKE '%" . $nombre. "%'";
            } 
            $q = Doctrine_Query::create();
            if ($filter) {
                $estudiante = $q->from('NomTipotasas e')->where($filter)
                    ->execute();
            } else {
                $estudiante = $q->from('NomTipotasas e')->execute();
            }
            if ($filter) {
                $estudiant = $q->from('NomTipotasas e')->where($filter)->limit(
                    $limit
                )->offset($start)->execute();
            } else {
                $estudiant = $q->from('NomTipotasas e')->limit($limit)->offset(
                    $start
                )->execute();
            }
            $estudiantes = $estudiant->toArray();

            $resultado = array('cant'  => $estudiante->count(),
                               'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Busca el nombre de tipo de tasa a partir de su denominación.
     *
     * @param mixed $denominacion Denominación de tasa.
     *
     * @return mixed Nombre del tipo de tasa
     */
    public function Buscar_Id_ByDenominacion($denominacion)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('tipo.nombretipotasa')->from(
            'NomTipotasas tipo'
        )->where('tipo.nombretipotasa=?', utf8_encode($denominacion))->execute(
        );
        return $result;
    }

    /**
     * Busca el nombre de tipo de tasa.
     *
     * @return mixed Nombre del tipo de tasa
     */
    public function Buscar_Id_ByDenominacionA()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('tipo.nombretipotasa')->from(
            'NomTipotasas tipo'
        )->where('tipo.idtipotasa=?', 2)->execute();
        return $result;
    }

    /**
     * Obtiene el mayor identificador asignado
     *
     * @param mixed $denominacion Denominación de tasa
     *
     * @return mixed Identificador
     */
    public function GetLLave()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('MAX(idtipotasa)')->from('NomTipotasas')
            ->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    /**
     * Obtiene una tasa a partir de su identificador .
     *
     * @param mixed $idtipotasa Identificador de tasa.
     *
     * @return mixed Tasa
     */
    public function Buscart($idtipotasa)
    {
        $temp = Doctrine::getTable('NomTipotasas')->find($idtipotasa);
        return $temp->toArray();
    }

    /**
     * Obtiene todos los datos de tasas.
     *
     * @return array Datos de las tasas
     */
    public function GetTodos()
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomTipotasas')->execute();
        $resultado = array('datos' => $result->toArray());
        return $resultado;
    }

    /**
     * Obtiene todos los datos de tasas utilizando límites.
     *
     * @param int $limite Límite
     * @param int $inicio Inicio
     *
     * @return array Datos de las tasas
     */
    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomTipotasas')->limit($limite)->offset($inicio)
            ->execute();
        return $result->toArray();
    }

}