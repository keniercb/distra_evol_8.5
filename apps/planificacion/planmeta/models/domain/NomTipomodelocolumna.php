<?php

class NomTipomodelocolumna extends BaseNomTipomodelocolumna {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomTipomodelo', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
        $this->hasOne(
                'NomColumna', array('local' => 'idcolumna', 'foreign' => 'idcolumna')
        );
        $this->hasOne(
                'NomTipocolumna', array('local' => 'idtipocolumna', 'foreign' => 'idtipocolumna')
        );
        $this->hasOne(
                'NomTiponomenclador', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador')
        );
    }

    public function Insertar(NomTipomodelocolumna $nomTipoModeloColumna) {
        $nomTipoModeloColumna->save();
    }

    public function Listar($idtipomodelo,$limit=null,$start=null) {
        $query = new Doctrine_Query();
        $total = $query->select(
            'tc.denominacion,m.idtipomodelocolumna,m.idtipomodelo, m.idcolumna,m.idcampo,
            d.denominacion, d.descripcion'
        )
            ->from('NomTipoModeloColumna m,m.NomColumna d')
            ->innerJoin('m.NomTipocolumna tc')
            ->where('m.idtipomodelo =?', $idtipomodelo)
            ->orderby('d.denominacion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        $res = $query->select(
                        'tc.denominacion,m.idtipomodelocolumna,m.idtipomodelo, m.idcolumna,m.idcampo,
            d.denominacion, d.descripcion'
                )
                ->from('NomTipoModeloColumna m,m.NomColumna d')
                ->innerJoin('m.NomTipocolumna tc')
                ->where('m.idtipomodelo =?', $idtipomodelo)
                ->offset($start)
                ->limit($limit)
                ->orderby('d.denominacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();//, COUNT(*) OVER() as total

        return array('total' => count($total), 'result' => $res);
    }

    public function eliminar($idtipomodelocolumna) {

        $inter = Doctrine::getTable('NomTipomodelocolumna')->find(
                $idtipomodelocolumna
        );
        $inter->delete();
    }

    public function existeColumna($idtipomodelo, $idcolumna) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'm.idtipomodelocolumna,m.idtipomodelo, m.idcolumna,m.idcampo,m.idtipocolumna'
                        )
                        ->from('NomTipomodelocolumna m')
                        ->where(
                                'm.idtipomodelo =? AND m.idcolumna=?', array($idtipomodelo, $idcolumna)
                        )
                        ->execute()->toArray();

        return $res;
    }

    function ListarColumnasImportarPlan($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
  comp.etiqueta as denomcolumna,
  td.denominacion as denomtipocolumna,
  c.denominacion,
  tdg.nombre,
  (rank() OVER (PARTITION BY tm.idtabla ORDER BY c.idcampo ASC))+3 as numero
FROM
  mod_metadata.dat_componente comp
  INNER JOIN mod_metadata.dat_campo c ON (comp.idcampo = c.idcampo)
  INNER JOIN mod_metadata.dat_tabla t ON (c.idtabla = t.idtabla)
  INNER JOIN mod_metadata.dat_tipodatogestor tdg ON (c.idtipodatogestor = tdg.idtipodatogestor)
  INNER JOIN mod_metadata.nom_tipodato td ON (tdg.idtipodato = td.idtipodato)
  INNER JOIN mod_planificacion.nom_tipomodelo tm ON (t.idtabla = tm.idtabla)
  WHERE 
  tm.idtipomodelo = $idtipomodelo
      order by c.idcampo";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_NUM);
        return $res;
    }
    
        function ListarNombreTabla($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT t.tabla
FROM mod_metadata.dat_tabla t
     INNER JOIN mod_planificacion.nom_tipomodelo tm ON (t.idtabla = tm.idtabla)
WHERE tm.idtipomodelo = $idtipomodelo";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }
    

}
