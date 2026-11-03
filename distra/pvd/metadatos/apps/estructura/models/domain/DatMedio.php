<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatMedio extends BaseDatMedio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTipomedio', array('local' => 'idtipomedio', 'foreign' => 'idtipomedio'));
        $this->hasOne('NomFilaestruc', array('local' => 'idmedio', 'foreign' => 'idfila'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('NomIcono', array('local' => 'idicono', 'foreign' => 'idicono'));
    }

    /**
     * Busca todos los medios insertados en la estructura dado un identificador y los medios existentes en la
     * estructura que coinciden con un filtro dado
     *
     * @param      $idmedio
     * @param      $idProyecto
     * @param bool $grafica
     * @param int  $limit
     * @param int  $start
     * @param bool $busqueda
     *
     * @return mixed : Retorna un arreglo con los elementos encontrados
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscar($idmedio, $idProyecto = 0, $grafica = false, $limit = 10, $start = 0, $busqueda = false)
    {
        $whereProyecto = ($idProyecto != 0) ?
            "((idestado = 0 and modificado[$idProyecto] = 0) " . "OR ( idproyecto = $idProyecto))" : '(idestado = 0)';
        if (!$grafica) {
            $object = Doctrine::getTable('DatMedio')->findByDql("idmedio = $idmedio AND $whereProyecto")->getFirst();
            if (is_object($object)) {
                $data = MetadatosServices::getInstance()->dameDatosMedio($object->idnommedio);
                $result = $this->asignaValorResult($object, $data);
            }

            return $result;
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->select('m.idnommedio as identificador, m.*, i.denominacion as nombre_imagen')->from(
                               'DatMedio m'
            )->leftJoin("m.NomIcono i")->limit($limit)->offset($start)->setHydrationMode(
                               Doctrine::HYDRATE_ARRAY
                )->execute();
            $result = array();
            foreach ($resultado as $value) {
                $result[] = $value['idnommedio'];
            }
            $data = MetadatosServices::getInstance()->dameDatosMedio($result);
            $result = array();
            foreach ($resultado as $value) {
                if (UtilModel::whereBusquedaDinamicaValores($busqueda, $data[$value['idnommedio']]['denominacion'])) {
                    $result[] = $value;
                    $result[count($result) - 1][denominacion] = $data[$value['idnommedio']]['denominacion'];
                }
            }

            return $result;
        }
    }

    /**
     *  Obtiene todos los medios que contienen una denominacion especificada
     *
     * @author    : Ing. Yoandy Borges
     * @modified  : Ing. Osvaldo Gonzalez
     *
     * @param $idNomMedio
     * @param $nodo
     *
     * @return bool : TRUE o FALSE en caso de existir elementos iguales a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeDenominacion($idNomMedio, $nodo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomFilaestruc f')->innerjoin('f.DatMedio m WITH m.idproyecto = 0')->where(
                           "m.idnommedio = $idNomMedio"
            )->andwhere("f.idpadre = $nodo")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * @param $object
     * @param $data
     *
     * @return mixed
     */
    private function asignaValorResult($object, $data)
    {
        $result = $object->toArray();
        $result['idnommedio'] = $object->idnommedio;
        $result['idicono'] = $object->idicono;
        $result['denominacion'] = $data[$object->idnommedio]['denominacion'];
        if ($object->idicono != '') {
            $icono = Doctrine::getTable('NomIcono')->find($object->idicono);
            $result['nombre_imagen'] = $icono->denominacion;

            return $result;
        } else {
            $result['nombre_imagen'] = '';

            return $result;
        }
    }
}