<?php

class NomTipoaccionimportar extends BaseNomTipoaccionimportar
{

    public function Setup()
    {
        parent::Setup();
        $this->hasMany(
            'DatConfiguraciontipoaccion',
            array('local' => 'idtipoaccion', 'foreign' => 'idtipoaccion')
        );
    }

    public function listarTipoAccion()
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomTipoaccionimportar')->setHydrationMode(
            Doctrine::HYDRATE_ARRAY
        )->execute();
        return $result;
    }

    public function listarTipoAccionDadoIdConcepto($idconcepto)
    {
        $query = Doctrine_Manager::connection();
        $sql
            = "SELECT d.idconfiguracion, d2.idconfiguracion,
            d2.idtipoaccion, n.idtipoaccion, n.denominacion 
            FROM mod_planifimportacion.nom_configuracionimportar d 
            INNER JOIN mod_planifimportacion.nom_configuraciontipoaccion d2 
            ON d.idconfiguracion = d2.idconfiguracion 
            INNER JOIN mod_planifimportacion.nom_tipoaccionimportar n
            ON d2.idtipoaccion = n.idtipoaccion WHERE d.idconcepto = ?";
        $result = $query->execute($sql, array($idconcepto));
        $result = $result->fetchAll(Doctrine::FETCH_ASSOC);

        return $result;
    }

}
