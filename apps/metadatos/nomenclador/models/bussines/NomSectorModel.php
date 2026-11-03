<?php

/**
 * Created by PhpStorm.
 * User: Javier
 * Date: 21/09/2016
 * Time: 11:37
 */
class NomSectorModel extends ZendExt_Model
{
    public function NomSectorModel()
    {
        parent::ZendExt_Model();
        $this->instance = new NomSector();
    }

    public function cantidad($data)
    {
        $where = '1=1';
        $valores = new stdClass();
        if (count($data) > 1) {
            $valores = $data[1];
        }
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
            $where .= " AND mod_estructuracomp.f_sustituiryconvertir(s.denominacion) ILIKE '%'||mod_estructuracomp.f_sustituiryconvertir('$denominacion')||'%'";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
            $where .= " AND mod_estructuracomp.f_sustituiryconvertir(s.abreviatura) ILIKE '%'||mod_estructuracomp.f_sustituiryconvertir('$abreviatura')||'%'";
        }
        $query = Doctrine_Query::create();
        $result = $query->select('s.*, n.denominacion')->from('NomSector s')
            ->where($where)->execute()->count();

        return $result;
    }

    function buscar($data)
    {
        $limit = $data[0];
        $start = $data[1];
        $data = $data[2];
        $valores = $data[1];
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $where = '1=1';
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
            $where .= " AND mod_estructuracomp.f_sustituiryconvertir(no.denominacion) ILIKE '%'||mod_estructuracomp.f_sustituiryconvertir('$denominacion')||'%'";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
            $where .= " AND mod_estructuracomp.f_sustituiryconvertir(no.abreviatura) ILIKE '%'||mod_estructuracomp.f_sustituiryconvertir('$abreviatura')||'%'";
        }
        $q = Doctrine_Query::create();
        $result = $q->select('no.*,no.idsector as id, no.denominacion')->from('NomSector no')
            ->where($where)
            ->orderBy('no.denominacion')->limit($limit)
            ->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function insertar($data)
    {
        $object = new NomSector();
        $valores = $data[2];
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $actual = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
        $object->denominacion = ucfirst($denominacion);
        $object->abreviatura = $abreviatura;
        $object->actual = $actual;
        $object->visible = $visible;
        $object->save();

        return true;
    }

    public function modificar($data)
    {
        $idsector = $data[0];
        $valores = $data[2];
        $actual = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
        $object = Doctrine::getTable('NomSector')->find($idsector);
        if (is_object($object)) {
            $denominacion = $valores->denominacion;
            $abreviatura = $valores->abreviatura;
            $object->denominacion = ucfirst($denominacion);
            $object->abreviatura = $abreviatura;
            $object->actual = $actual;
            $object->visible = $visible;
            $object->save();
            return true;
        }

        return false;
    }

    public function eliminar($data)
    {
        $idsector = $data[0];
        $object = Doctrine::getTable('NomSector')->find($idsector);
        if (is_object($object)) {
            $object->delete();

            return true;
        }

        return false;
    }

    public function activar($data)
    {
        $idsector = $data[0];
       // try {
            $object = Doctrine::getTable('NomSector')->find($idsector);

            $object->actual = 1;
            $object->visible = 1;
            $object->save();

            return true;

        /*} catch (Doctrine_Exception $ee) {
            return false;
        }*/
    }

    public function desactivar($data)
    {
        $idsector = $data[0];
        //try {
            $object = Doctrine::getTable('NomSector')->find($idsector);
            $object->actual = 0;
            $object->visible = 0;
            $object->save();

            return true;

       /* } catch (Doctrine_Exception $ee) {
            return false;
        }*/
    }
}