<?php

class DatTipocartatiponomenclador extends BaseDatTipocartatiponomenclador {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomTipocarta', array(
            'local' => 'idtipocarta',
            'foreign' => 'idtipocarta'
                )
        );
        $this->hasMany('DatCaracterizacioncarta', array(
            'local' => 'idtipocartatiponomenclador',
            'foreign' => 'idtipocartatiponomenclador'
                )
        );
    }

    public function NomeAsocACarta($idtipocarta) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                        nom_tiponomenclador.denominacion, 
                        nom_tiponomenclador.descripcion, 
                        nom_tiponomenclador.idtiponomenclador,
                        nom_tiponomenclador.uritiponomenclador
                      FROM 
                        mod_spouam.dat_tipocartatiponomenclador, 
                        mod_planificacion.nom_tiponomenclador
                      WHERE 
                        dat_tipocartatiponomenclador.idtiponomenclador = nom_tiponomenclador.idtiponomenclador AND
                        dat_tipocartatiponomenclador.idtipocarta = $idtipocarta;";

        $res = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function Eliminar($param) {
        Doctrine_Query::create()->delete('DatTipocartatiponomenclador')
                ->from('DatTipocartatiponomenclador')
                ->whereIn('idtipocarta', $param)
                ->execute();
        return true;
    }
    
    public function Insertar(DatTipocartatiponomenclador $dtc) {
        return $dtc->save();
    }
    
    public function EliminarUnoSolo($param) {
        Doctrine_Query::create()->delete('DatTipocartatiponomenclador')
                ->from('DatTipocartatiponomenclador')
                ->whereIn('idtipocarta', $param->idtipocarta)
                ->whereIn('idtiponomenclador', $param->idtiponomenclador)
                ->execute();
        return true;
    }
}

?>
