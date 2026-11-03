<?php

class NomTipotransfinterna extends BaseNomTipotransfinterna
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
                'NomTipotransfinternaarea',
                array('local' => 'idtipotransfinterna',
            'foreign' => 'idtipotransfinterna')
        );
        $this->hasMany(
                'DatTipotransfinternaEntidad',
                array('local' => 'NomTipotransfinterna',
            'foreign' => 'idtipotransfinterna')
        );
    }

    public function BuscarTipoTransf($descripcion, $automatica, $idestructura)
    {
        if ($descripcion) {
            $arrFiltro[] = "lower(descripcion) like '%$descripcion%' ";
        }
        if (!$automatica) {
            $arrFiltro[] = "automatica != 1";
        }

        if ($idestructura) {
            $arrFiltro[] = "dtt.idestructuracomun = " . $idestructura;
        }

        $filtro = implode(' AND ', $arrFiltro);

        $query = Doctrine_Query::create();
        if ($filtro) {
            $query->addWhere($filtro);
        }

        $query->select(
                        '*, ntta.idtiporotacionarea, nta.nacionalexportacion'
                )
                ->from('NomTipotransfinterna ntt')
                ->innerJoin('ntt.DatTipotransfinternaEntidad dtt')
                ->innerJoin('ntt.NomTipotransfinternaarea ntta')
                ->innerJoin('ntta.NomTipoarea nta')
                ->orderBy('idtiporotacion DESC')
                ->fetchArray();
        return $query->execute();
    }

    public function ObtenerDatosTraspaso($objTipoTraspaso, $arrIdsInsertados = array())
    {
        $filtro = '';
        if ($objTipoTraspaso->descripcion) {
            $arrFiltro [] = "lower(descripcion) LIKE '%$objTipoTraspaso->descripcion%'";
        }
        if ($objTipoTraspaso->codigo) {
            $arrFiltro [] = "codigo LIKE '%$objTipoTraspaso->codigo%'";
        }
        $query = new Doctrine_Query();
        if ($objTipoTraspaso->descripcion || $objTipoTraspaso->codigo) {
            $filtro = implode(' AND ', $arrFiltro);
            //print_r($filtro);die;
            $query->addWhere($filtro);
        }

        if (count($arrIdsInsertados) > 0) {
            $query->whereNotIn("idtiporotacion", $arrIdsInsertados);
        }

        $result = $query->select('ntf.*,ntfa.*,nta.*')
                ->from('NomTipotransferencia ntf')
                ->innerJoin('ntf.NomTipotransferenciaarea ntfa')
                ->innerJoin('ntfa.NomTipoarea nta')
                ->orderBy('idtipotransferencia DESC')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ValDatosTraspaso($objTipo, $arrIdsInsertados = array())
    {
        //print_r($objTipo); die;
        $filtro = '';
        if ($objTipo->descripcion) {
            $arrFiltro [] = "lower(descripcion) LIKE '%$objTipo->descripcion%'";
        }
        if ($objTipo->codigo) {
            $arrFiltro [] = "codigo LIKE '%$objTipo->codigo%'";
        }
        $query = new Doctrine_Query();
        if ($objTipo->descripcion || $objTipo->codigo) {
            $filtro = implode(' AND ', $arrFiltro);
            //print_r($filtro);die;
            $query->addWhere($filtro);
        }

        if (count($arrIdsInsertados) > 0) {
            $query->whereNotIn("idtiporotacion", $arrIdsInsertados);
        }

        $result = $query->select('ntf.*,ntfa.*,nta.*')
                ->from('NomTipotransfinterna ntf')
                ->innerJoin('ntf.NomTipotransfinternaarea ntfa')
                ->innerJoin('ntfa.NomTipoarea nta')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function EliminarTipoTransf($idtipotransferencia)
    {
        $query = new Doctrine_Query();
        $result = $query->delete()
                ->from('NomTipotransfinterna')
                ->where('idtiporotacion =?', $idtipotransferencia)
                ->execute();
        return $result;
    }

    public function CantidadTipoTransf()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipotransfinterna ntf')
                ->innerJoin('ntf.NomTipotransfinternaarea ntfa')
                ->innerJoin('ntfa.NomTipoarea nta')
                ->count();
        return $result;
    }

    public function DatosTipoTransferencia($idtipotransferencia)
    {
        $query = new Doctrine_Query();
        $result = $query->select('*')
                ->from('NomTipotransfinterna')
                ->where('idtiporotacion =?', $idtipotransferencia)
                ->execute();
        return $result->toArray();
    }



}
