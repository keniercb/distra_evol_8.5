<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatEstructura extends BaseDatEstructura
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomOrgano', array('local' => 'idorgano', 'foreign' => 'idorgano'));
        $this->hasOne('NomOrgano', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasOne('NomFilaestruc', array('local' => 'idestructura', 'foreign' => 'idfila'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('NomTipoEscala', array('local' => 'idtipoescala', 'foreign' => 'idtipoescala'));
        $this->hasOne('NomSector', array('local' => 'idtipoescala', 'foreign' => 'idsector'));
        $this->hasOne('NomIcono', array('local' => 'idicono', 'foreign' => 'idicono'));
    }

    /**
     * Busca todos los elementos de la tabla que se correspondan con el id pasado por parametro
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     *
     * @param $idEstructura
     *
     * @return mixed : Retorna un arreglo con las instancias de la tabla encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscar($idEstructura, $idproyecto = 0)
    {
        $object = Doctrine::getTable('DatEstructura')->find(array($idEstructura, $idproyecto));

        return $object->toArray();
    }

    /**
     * Obtiene todas las estructuras que contienen una denominacion especificada
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param        $idconcepto
     * @param string $denominacion
     * @param int    $nodo
     *
     * @return bool : TRUE o FALSE en caso de existir elementos iguales a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeDenominacion($idconcepto, $denominacion, $nodo, $iddpt)
    {
        if (is_numeric($nodo)) {
            $where = " f.idpadre = $nodo";
        } else {
            $where = "  f.idpadre = f.idfila";
        }
        $w  = ($idconcepto == 3) ? " and e.iddpt=$iddpt" : "and  1=1";
        $query = Doctrine_Query::create();
        $query->from('NomFilaestruc f')->innerjoin('f.DatEstructura e WITH e.idproyecto =0')->where(
          "f.fechafin IS NULL AND LOWER(e.denominacion) = LOWER('$denominacion') $w "
        )->andwhere("e.idconcepto = $idconcepto");
        if ($idconcepto != 3 && $idconcepto != 4) {
            $query->andwhere($where);
        }
        // Util::msg($query->getSqlQuery());
        $resultado = $query->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Obtiene la cantidad de entidades u organizaciones que poseen el mismo codigo reeup
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param        $idconcepto
     * @param        $codigo
     * @param        $nodo
     *
     * @return bool : TRUE o FALSE en caso de existir elementos iguales a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeCodigo($idconcepto, $codigo, $nodo = false)
    {
        $query = Doctrine_Query::create();
        $query->from('NomFilaestruc f')->innerjoin('f.DatEstructura e WITH e.idproyecto =0')->where(
              "f.fechafin IS NULL AND e.codigo = ?", $codigo
        )->andwhere(
              "e.idconcepto = $idconcepto"
            );
        if (is_numeric($nodo)) {
            $query->andwhere("e.idestructura <> $nodo");
        }
        $resultado = $query->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    static function dameCantidadCargosDirectos($idEntidad, $proyecto)
    {
        $query            = Doctrine_Query::create();
        $rangos           = $query->select('parent_path')->from('NomFilaestruc fila')->where("idfila = $idEntidad")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $parent_path              = $rangos[0]['parent_path'];

        $total            = $query->from('NomFilaestruc fila')->innerJoin('fila.DatCargo c')->where(
            "fila.fechafin IS NULL AND (fila.parent_path operator (public.<@) '$parent_path')"
        )                         ->andWhere(
            "((c.idestado = 0 AND c.modificado [$proyecto]=0) OR (c.idproyecto = $proyecto))"
        )                       ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $cantidadDirectos = $query->from('NomFilaestruc fila')->innerJoin('fila.DatCargo c')->where(
            "fila.fechafin IS NULL AND (fila.parent_path operator (public.<@) '$parent_path') AND c.directo = 1"
        )                         ->andWhere(
            "((c.idestado = 0 AND c.modificado [$proyecto]=0) OR (c.idproyecto = $proyecto))"
        )                       ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return array('total' => count($total), 'directos' => count($cantidadDirectos));
    }
}