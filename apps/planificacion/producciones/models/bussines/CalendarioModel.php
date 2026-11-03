<?php

class CalendarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function obtenerActividadesProduccionConFecha($parametros)
    {
        if (isset($parametros['idestructura'])) {
            try {
                $idestructura = $parametros['idestructura'];
                $fechainicio = $parametros['fechainicio'];
                $fechafin = $parametros['fechafin'];
                $conn = Doctrine_Manager::connection();
                $query = 'SELECT
                            a.denominacion as title,
                            a.descripcion as description,
                            fechainicio,
                            fechafin
                          FROM
                              mod_spouam.dat_actividadentidadprodcartatec actprod
                              inner join mod_planificacion.dat_actividadentidad ae
                              on(ae.idactividadentidad=actprod.idactividadentidad)
                              inner join mod_planificacion.nom_actividad a
                              on(a.idactividad=ae.idactividad)
                              where ae.identidad='."$idestructura AND actprod.fechainicio <= '$fechafin'
                              AND actprod.fechafin >= '$fechainicio'".'
                              order by a.denominacion;';
                /*print_r($query);
                die;*/
                $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
                return $data;
            } catch (Exception $e) {

            }
        }
    }

}