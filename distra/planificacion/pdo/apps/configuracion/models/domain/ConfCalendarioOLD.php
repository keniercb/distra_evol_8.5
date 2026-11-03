<?php

class ConfCalendario extends BaseConfCalendario
{
    public function setUp()
    {
        parent:: setUp();

        $this->hasOne(
            'NomTipoDia', array('local'   => 'idtipodia',
                                'foreign' => 'idtipodia')
        );
    }

    public function getCalendarioPorEstructura($idestructura, $anno)
    {
        $query = new Doctrine_Query ();
        $query->select(
            'cf.horas, cf.fechas as fecha, ntp.color, n.dennomenclador as dentipodia, c.idestructura'
        )
            ->from('ConfCalendariofechas cf')
            ->innerJoin('cf.ConfCalendario c')
            ->innerJoin('c.NomTipoDia ntp')
            ->innerJoin('ntp.NomNomenclador n')
            ->where("c.idestructura = $idestructura AND cf.anno = $anno")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();

    }

    public function existeEstructuraDadoAnno($parametros)
    {
        $idestructura = $parametros['idestructura'];
        $anno = $parametros['anno'];
        $query = new Doctrine_Query ();
        $query->select(
            'cf.idcalendario'
        )
            ->from('ConfCalendariofechas cf')
            ->innerJoin('cf.ConfCalendario c')
            ->where("c.idestructura = $idestructura AND cf.anno = $anno")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();

    }

    public function eliminar($idcalendario)
    {
        try {
            $calendario = Doctrine::getTable('ConfCalendario')
                ->findByDql(
                    "idcalendario = $idcalendario"
                );
            if (isset ($calendario[0])) {
                $calendario->delete();
                return true;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarCalendarioPorEstructura($parametros)
    {
        $idestructura = $parametros['idestructuracompartir'];
        $anno = $parametros['anno'];
        $query = new Doctrine_Query ();
        $row = $query->delete(
            'ConfCalendariofechas'
        )
            ->from('ConfCalendariofechas cf')
            ->innerJoin('cf.ConfCalendario c')
            ->addWhere("c.idestructura = $idestructura AND cf.anno = $anno")
            ->whereIn('idestructura', $idestructura)
            ->execute();

        return $row;

    }


}

?>