<?php

class NomConfiguracionReporte extends BaseNomConfiguracionReporte
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerConfiguracionDadoId($idconfiguracion)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomConfiguracionReporte cr')
                ->where('cr.idconfiguracion = ?', $idconfiguracion)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result[0];
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

    public function obtenerDatosConfiguracionReporteSql($params)
    {
        extract($params);
        $cadenasql = 'SELECT DISTINCT cr.apikey,
                           cr.urlservidor,
                           cr.usuario,
                           cr.autenticarapikey,
                           cr.usuariors,
                           cr.contrasenna,
                           cr.idsso,
                           r.idreportereportserver,
                           r.idreporte';
        $cadenasql .= (!empty($datosfiltros)) ? ',rf.nombreparametro, rf.tipo, rf.idfiltro,  rfnom.enviarid, rfnom.nomidentificador' : '';
        $cadenasql .= ' FROM mod_integracionreporte.nom_configuracionreporte cr
                      INNER JOIN mod_integracionreporte.dat_reporte r ON(cr . idconfiguracion = r . idconfiguracion)';
        $cadenasql .= (!empty($datosfiltros)) ? ' INNER JOIN mod_integracionreporte . dat_reportefiltro rf ON(r . idreporte = rf . idreporte) 
                                                  LEFT JOIN mod_integracionreporte.dat_reportefiltronomenclador rfnom ON (rf.idfiltro = rfnom.idfiltro)' : '';
        $cadenasql .= " WHERE (r.idreporte = $idreporte)";
        try {
            $conn = Doctrine_Manager::connection();
            $result = $conn->execute($cadenasql)->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

    public function obtenerDatosConfiguracionReporte($idreporte)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('r . idreportereportserver, cr .*')
                ->from('DatReporte r')
                ->innerJoin('r . NomConfiguracionReporte cr')
                ->where("r.idreporte = $idreporte")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            //$temp = $query->getSqlQuery();
            return $result[0];
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

}

//fin clase 
