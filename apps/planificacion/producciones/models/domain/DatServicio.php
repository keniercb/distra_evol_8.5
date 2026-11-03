<?php

class DatServicio extends BaseDatServicio {

    public function setUp() {
        parent::setUp();
    }

    public function listarServiciosActividadesProduccion($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT s.idaplicacioncartatec,
                        s.idactividad,
                        s.idservicio,
                        act.codigo,
                        act.denominacion,
                        s.gasto,
                        s.idcartatecnologicaactividad,
                        s.idusuario,
                        s.fecha,
                        count(*) over() as total
                 FROM mod_spouam.dat_servicio s
                      INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad =
                        s.idactividad)
                 WHERE s.idaplicacioncartatec = {$params['idaplicacioncartatec']} AND
                       s.idcartatecnologicaactividad = {$params['idcartatecnologicaactividad']}";
        //print_r($query);        die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}

//fin clase 