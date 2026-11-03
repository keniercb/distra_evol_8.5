<?php

class DatRelacion extends BaseDatRelacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCampo as Origen', array('local' => 'campoorigen', 'foreign' => 'idcampo'));
        $this->hasOne('DatCampo as Destino', array('local' => 'campodestino', 'foreign' => 'idcampo'));

        $this->hasMany('DatRemoto as OrigenRemoto', array('local' => 'campoorigen', 'foreign' => 'campoorigen'));
        $this->hasMany('DatRemoto as DestinoRemoto', array('local' => 'campodestino', 'foreign' => 'campodestino'));
    }

    public function obtenerRelacionesTabla($idtabla)
    {
        $arrNom = array();
        $q = Doctrine_Query :: create();
        $result_nom = $q->select('t.idtabla')
            ->from('DatTabla t')
            ->innerJoin('t.DatCampo c')
            ->innerJoin('c.Destino d')
            ->innerJoin('d.DestinoRemoto dr')
            ->innerJoin('dr.Origen or')
            ->innerJoin('or.Origen o')
            ->innerJoin('o.DatTabla to')
            ->where('to.idtabla = ? ', $idtabla)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute();

        foreach ($result_nom as $nom) {
            $arrNom [] = $nom->idtabla;
        }

        $query = Doctrine_Query :: create();

        $query->select('t.idtabla,t.alias,t.esquema,t.arbol,t.importada')
            ->from('DatTabla t')
            ->innerJoin('t.DatCampo c')
            ->innerJoin('c.Destino d')
            ->innerJoin('d.Origen o')
            ->innerJoin('o.DatTabla to')
            ->where('to.idtabla = ? ', $idtabla)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD);

        if (count($arrNom) > 0) {
            $query->whereNotIn('t.idtabla', $arrNom);
        }

        $result = $query->execute();

        return $result;
    }

    function obtenerCamposRelacionados($tablaOrigen, $tablaDestino)
    {
        $query = Doctrine_Query :: create();

        $query->select('o.idcampo as campoorigen,d.idcampo as campodestino')
            ->from('Destino d')
            ->innerJoin('d.Origen o')
            ->innerJoin('o.DatTabla to')
            ->innerJoin('d.DatTabla td')
            ->where('to.idtabla = ? AND td.idtabla = ?', array($tablaOrigen, $tablaDestino))
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD);
    }

}