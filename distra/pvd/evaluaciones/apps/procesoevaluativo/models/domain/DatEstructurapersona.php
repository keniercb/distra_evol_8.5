<?php

class DatEstructurapersona extends BaseDatEstructurapersona
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatEvaldefprocesoplanillas',
            array('local' => 'idprocesoplanilla', 'foreign' => 'idprocesoplanilla')
        );
        $this->hasMany(
            'DatEstructuraevaluativa',
            array('local' => 'idestructuraevaluativa', 'foreign' => 'idestructuraevaluativa')
        );
        $this->hasMany('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany(
            'DatEvalpersonaevaluacion', array('local' => 'idestructurapersona', 'foreign' => 'idestructurapersona')
        );
    }

    public function Buscar($idestructurapersona)
    {
        return Doctrine::getTable('DatEstructurapersona')->find($idestructurapersona);
    }

    public function getAll($idestructuraevaluativa, $limit, $start, $filter)
    {

        $queryObj = Doctrine_Query::create()
            ->select('e.idestructurapersona, e.idestructuraevaluativa, e.idprocesoplanilla, e.fechadesactivacion')
            ->from('DatEstructurapersona e')			
            ->where('e.idestructuraevaluativa = ?', $idestructuraevaluativa);

        if (!empty($filter)) {
            $queryObj->addWhere(
                "p.nombre ILIKE '%$filter%' OR p.snombre ILIKE '%$filter%' OR p.papel ILIKE '%$filter%' OR p.sapel ILIKE '%$filter%'"
            );
        }
        $array = Array();
        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'e', 'p', true, $array);
        if ($limit) {
            $queryObj->limit($limit);
        }
        if ($start) {
            $queryObj->offset($start);
        }

        return $queryObj->fetchArray();
    }

    public function total($idestructuraevaluativa, $filter)
    {
        $queryObj = Doctrine_Query::create()
            ->select('COUNT(e.idestructurapersona) AS cantidad')
            ->from('DatEstructurapersona e')
            ->where('e.idestructuraevaluativa = ?', $idestructuraevaluativa);


        if (!empty($filter)) {
            $queryObj->addWhere(
                "p.nombre ILIKE '%$filter%' OR p.snombre ILIKE '%$filter%' OR p.papel ILIKE '%$filter%' OR p.sapel ILIKE '%$filter%'"
            );
        }

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'e', 'p', false);

        return $queryObj->fetchOne()->cantidad;
    }

    /**
     * Devuelve el las personas de una estructura evaluativa en un proceso evaluativo dado.
     *
     * @param $idpreprocesoevaluativo
     *
     * @return array
     */
    public function getEstPersonByProces($idpreprocesoevaluativo)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'e.idestructuraevaluativa, p.idestructurapersona as idestructurapersona,
                p.idprocesoplanilla as idprocesoplanilla, p.fechadesactivacion as fechadesactivacion'
            )
            ->from('DatEstructuraevaluativa e')
            ->innerJoin('e.DatEstructurapersona p')
            ->where('e.idpreprocesoevaluativo = ?', $idpreprocesoevaluativo);

        return $queryObj->fetchArray();
    }

    public function getIdEstPersona($idpreprocesoevaluativo)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select dep.idestructurapersona AS idestructurapersona
                from mod_evaluaciones.dat_estructurapersona dep
                inner join mod_evaluaciones.dat_estructuraevaluativa dee
                on dee.idestructuraevaluativa = dep.idestructuraevaluativa
                where dee.idpreprocesoevaluativo ='{$idpreprocesoevaluativo}'";

        return $conn->fetchAll($sql);
    }

    /**
     * Obtiene las personas con la planilla y modelo a utilizar en el proceso evaluativo
     *
     * @param $idpreprocesoevaluativo
     *
     * @return array
     */
    public function getEstPersPlanillaModelo($idpreprocesoevaluativo)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql
            = "select ep.idestructurapersona, ep.idpersona, pp.idplanilla, pp.idmodelo, epp.idpersona as idpersonaevaluador,
                ep.nopersona as nopersona
                from mod_evaluaciones.dat_estructurapersona ep
                inner join mod_evaluaciones.dat_estructuraevaluativa ev
                  ON (ev.idestructuraevaluativa = ep.idestructuraevaluativa AND ev.idpreprocesoevaluativo = {$idpreprocesoevaluativo})
                left join mod_evaluaciones.dat_estructuraevaluativa evp
                  ON (evp.idestructuraevaluativa = ev.idpadre)
                left join mod_evaluaciones.dat_estructurapersona epp
                  ON (evp.idestructuraevaluativa = epp.idestructuraevaluativa AND epp.fechadesactivacion is null)
                inner join mod_evaluaciones.dat_evaldefprocesoplanillas pp
                  ON (pp.idprocesoplanilla = ep.idprocesoplanilla)
                  where epp.idpersona is not null";

        return $conn->fetchAll($sql);
    }

    public function getDatosPlanillaModeloPersona($idpersonaevaluacion)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select epe.idmodelo as idmodelo, epe.idplanilla as idplanilla
                from mod_evaluaciones.dat_evalpersonaevaluacion epe
                where epe.idpersonaevaluacion = '{$idpersonaevaluacion}'";

        return $conn->fetchAll($sql);
    }

}
