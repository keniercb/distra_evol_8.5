<?php

class NomConcepto extends BaseNomConcepto
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarTodos($identidad, $parametros, $start, $limit)
    {
        $query = Doctrine_Query::create();
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $estructura[0]->idespecialidad;
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                            "upper(c.denominacion) LIKE '%" . strtoupper($s)
                            . "%'"
                        );
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere(
                                "upper(c.descripcion) LIKE '%" . strtoupper($s)
                                . "%'"
                            );
                        }
                    }
                }
            }
        }
        $query->from('NomConcepto c')
            ->innerJoin('c.DatConceptoespecialidad ce')
            ->addWhere('ce.idespecialidad = ?', array($idespecialidad))
            ->offset($start)
            ->limit($limit)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function listarDadoIdEntidad($identidad)
    {
        $query = Doctrine_Query::create();
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $estructura[0]->idespecialidad;
        $query->from('NomConcepto c')
            ->innerJoin('c.DatConceptoespecialidad ce')
            ->where('ce.idespecialidad = ?', array($idespecialidad))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function obtenerTotal($identidad, $parametros)
    {
        $query = Doctrine_Query::create();
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $estructura[0]->idespecialidad;
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                            "upper(c.denominacion) LIKE '%" . strtoupper($s)
                            . "%'"
                        );
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere(
                                "upper(c.descripcion) LIKE '%" . strtoupper($s)
                                . "%'"
                            );
                        }
                    }
                }
            }
        }
        $query->from('NomConcepto c')
            ->innerJoin('c.DatConceptoespecialidad ce')
            ->addWhere('ce.idespecialidad = ?', array($idespecialidad));
        $result = $query->count();
        return $result;
    }

    public function listarebDocaprob($identidad)
    {
        $query = Doctrine_Query::create();
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $estructura[0]->idespecialidad;
        $query->select(
            'c.idconcepto,c.denominacion,ce.idconceptoespecialidad as idconceptoespecialidad'
        )->from(
            'NomConcepto c'
        )
            ->innerJoin('c.DatConceptoespecialidad ce')
            ->where('ce.idespecialidad = ?', array($idespecialidad))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function obtenerDatosConceptoDadoId($idconcepto)
    {
        $query = Doctrine_Query::create();
        $query->from('NomConcepto c')
            ->where('c.idconcepto = ?', array($idconcepto))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function obtenerConceptoDadoId($idconcepto)
    {
        $concepto = Doctrine::getTable('NomConcepto')->find($idconcepto);
        return $concepto;
    }

    public function obtenerConceptoDadoDenominacion($denominacion, $identidad)
    {
        $query = Doctrine_Query::create();
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $estructura[0]->idespecialidad;
        $query->from('NomConcepto c')
            ->innerJoin('c.DatConceptoespecialidad ce')
            ->where('ce.idespecialidad = ?', array($idespecialidad))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $query->addWhere(
            'lower(c.denominacion) = ?', array(strtolower($denominacion))
        );
        $result = $query->execute();
        return $result;
    }

    public function existeDenominacionModificar($denominacion, $idconcepto)
    {
        $query = new Doctrine_Query();
        return $query->select('d.denominacion,d.idconcepto')
            ->from('NomConcepto d')
            ->where(
                'UPPER(d.denominacion) = ? AND d.idconcepto<>?',
                array(strtoupper($denominacion), $idconcepto)
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

}
