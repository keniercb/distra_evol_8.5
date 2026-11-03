<?php

class ConfDatonomencladorrelacionxperiodo extends BaseConfDatonomencladorrelacionxperiodo {

    public function setUp() {
        parent::setUp();
    }

    public function convertirNomencladorxPeriodo($uridatonomencladororigen, $uritiponomencladordestino = null, $uridatonomencladororigen = null) {
        $tipo_destino = "";
        if ($uritiponomencladordestino) {
            $tipo_destino = " AND dnrp.uritiponomencladordestino = $uritiponomencladordestino ";
        }

        $dato_origen = "";
        if ($uritiponomencladordestino) {
            $dato_origen = " AND dnrp.uridatonomencladororigen = $uridatonomencladororigen ";
        }

        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT dnrp.uritiponomencladororigen,
                            dnrp.uritiponomencladordestino,
                            dnrp.uridatonomencladororigen,
                            dnrp.uridatonomencladordestino,
                            ndnd.iddatosnomenclador
                     FROM mod_planificacion.conf_datonomencladorrelacionxperiodo dnrp
                              INNER JOIN mod_planificacion.nom_tiponomenclador ntno ON (ntno.uritiponomenclador = dnrp.uritiponomencladororigen)
                              INNER JOIN mod_planificacion.nom_tiponomenclador ntnd ON (ntnd.uritiponomenclador = dnrp.uritiponomencladordestino)
                              INNER JOIN mod_planificacion.nom_datosnomenclador ndno ON (ndno.uridatosnomenclador = dnrp.uridatonomencladororigen)
                              INNER JOIN mod_planificacion.nom_datosnomenclador ndnd ON (ndnd.uridatosnomenclador = dnrp.uridatonomencladordestino)
                     WHERE dnrp.uritiponomencladororigen = $uridatonomencladororigen 
                         $tipo_destino
                         $dato_origen";
        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}

?>
