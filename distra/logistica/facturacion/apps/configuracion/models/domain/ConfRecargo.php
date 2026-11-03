<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class ConfRecargo extends BaseConfRecargo
{

    public function Setup()
    {
        $this->hasOne(
            'ConfConfiguracionfactura',
            array(
                'local'   => 'idestructuracomun',
                'foreign' => 'idestructuracomun'
            )
        );
        parent::Setup();
    }

    /**
     * Funcion que permite eliminar todos los recargos
     * de Facturacion para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return boolean Retorna true si fue un exito
     */
    public function deleteAllRecargos($params)
    {
        Doctrine_Query::create()
            ->delete()
            ->from('ConfRecargo')
            ->where(
                'idestructuracomun = ?',
                array($params['idestructuracomun'])
            )
            ->execute();
        return true;
    }

    /**
     * Funcion que permite guardar la configuracion de los recargos
     * de Facturacion para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function addRecargos($params)
    {
        self::deleteAllRecargos($params);
        $collection = new Doctrine_Collection('ConfRecargo');
        foreach ($params['recargos'] as $value) {
            $recargo = new ConfRecargo();
            $porcentual = $value->porcentual;
            $newRecargo = array(
                'idestructuracomun' => $params['idestructuracomun'],
                'valor'             => $value->valor,
                'porcentual'        => ($porcentual == 1) ? $porcentual : 0
            );
            $recargo->synchronizeWithArray($newRecargo);
            $collection->add($recargo);
        }
        $collection->save();
    }

    /**
     * Funcion que permite cargar los recargos segun la estructura
     *
     * @param mixed $idestructuracomun El identificador de la estructura
     *
     * @return array Retorna todos los recargos configurados
     * y la cantidad total para la estructura
     */
    public function loadRecargos($params)
    {
        $query = Doctrine_Query::create()
            ->select('*')
            ->from('ConfRecargo')
            ->where('idestructuracomun = ?', array($params['idestructuracomun']));
        return [
            'cantidad' => $query->count(),
            'datos'    => $query->limit($params['limit'])->offset($params['start'])->fetchArray()
        ];
    }

    /**
     * Funcion que permite eliminar recargos de la estructura
     *
     * @param mixed $idrecargo El identificador del recargo a eliminar
     *
     * @return boolean Retorna true si fue un exito eliminar los recargos
     */
    public function deleteRecargoById($idrecargo)
    {
        Doctrine_Query::create()
            ->delete()
            ->from('ConfRecargo')
            ->where('idrecargo = ?', array($idrecargo))
            ->execute();
        return true;
    }

}
