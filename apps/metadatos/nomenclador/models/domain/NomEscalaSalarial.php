<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomEscalaSalarial extends BaseNomEscalaSalarial
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomSalario', array('local' => 'idsalario', 'foreign' => 'idsalario'));
        $this->hasOne('NomTipoEscala', array('local' => 'idtipoescala', 'foreign' => 'idtipoescala'));
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con la misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param          $paramIdTipoEscala
     * @param          $paramIdSalario
     * @param bool|int $idEscala
     *
     * @internal  param bool $modificar
     * @return bool : bool Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c) 2014 xetid
     */
    function existeEscala($paramIdTipoEscala, $paramIdSalario, $idEscala = false)
    {
        if ($idEscala) {
            $object = Doctrine::getTable('NomEscalaSalarial')->find($idEscala);

            $idtipoescala = $object->idtipoescala;
            $idsalario = $object->idsalario;
            if ($idtipoescala <> $paramIdTipoEscala || $idsalario <> $paramIdSalario) {
                return $this->existeEscala($paramIdTipoEscala, $paramIdSalario);
            } else {
                return false;
            }
        } else {

            $query = Doctrine_Query::create();
            $resultado = $query->select('es.idtipoescala,s.idgrupocomplejidad as idgrupocomplejidad,es.idsalario,g.denominacion as grupocomplejidad,te.*')
                ->from('NomEscalaSalarial es')
                ->innerJoin('es.NomTipoEscala te')
                ->innerJoin('es.NomSalario s')
                ->innerJoin('s.NomGrupocomplejidad g')
                ->where("es.idtipoescala = $paramIdTipoEscala AND es.idsalario = $paramIdSalario")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            if (count($resultado) > 0) {

                return $resultado;
            }
            return false;
        }
    }

    /**
     * Descripción del método: Verifica si la escala especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param    int $id , id del elemento a saber si esta en uso
     *
     * @return bool Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c)2013 xetid
     */
    static function verificarUsoEscala($id)
    {
        $escala = Doctrine::getTable('NomEscalaSalarial')->find($id);
        $cargos = Doctrine::getTable('DatCargo')->findByDql("idsalario = " . $escala->idsalario);
        $integrator = ZendExt_IoC::getInstance();
        foreach ($cargos as $cargo) {
            $estructura = $integrator->metadatos->obtenerPadreEntidad($cargo->idcargo);
            if ($estructura[0]->idtipoescala == $escala->idtipoescala) {
                return true;
            }
        }

        return false;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Escala salarial
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool $closed
     * @param int  $limit
     * @param int  $offset
     *
     * @return mixed : mixed, Retorna un arreglo con las escalas salariales
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameTodos($closed = false, $limit = 10, $offset = 0)
    {
        $where = "1 = 1";
        $query = Doctrine_Query::create();
        $query->from('NomEscalaSalarial')->where($where)->orderBy('idescalasalarial');
        if ($closed) {
            $query->addWhere("fechafin IS NOT NULL");
        } else {
            $query->addWhere("fechafin IS NULL");
        }
        if (is_numeric($limit)) {
            $query->limit($limit);
        }
        if (is_numeric($limit)) {
            $query->limit($limit);
        }
        if (is_numeric($offset)) {
            $query->offset($offset);
        }
        $resultado = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $resultado;
    }
}