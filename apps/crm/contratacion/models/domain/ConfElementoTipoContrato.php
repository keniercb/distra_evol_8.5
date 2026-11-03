<?php

class ConfElementoTipoContrato extends BaseConfElementoTipoContrato
{

    public function setUp()
    {
        parent::setUp();
    }

    public function cargarElementos($filter = '')
    {
        $where = $this->createCondition($filter);
        if (count($where)) {
            $where = "where ".implode(" AND ", $where);
        } else {
            $where = "";
        }
        $query = "SELECT e ->> 'idelemento' AS idelemento,e ->> 'denominacion' AS denominacion,
                  (CASE WHEN e ->> 'idelemento' = e ->> 'idpadre' AND e ->> 'leaf' = 'false'
                    THEN 1
                   ELSE 0 END)             AS expanded,
                  e ->> 'tipo'             AS tipo,
                  e ->> 'humanlabel'       AS humanlabel,
                  e ->> 'namecomponent'    AS namecomponent,
                  e ->> 'mextype'          AS mextype,
                  e ->> 'cfg'              AS cfg,
                  e ->> 'event'            AS event,
                  e ->> 'fuente'           AS fuente,
                  e ->> 'model'            AS model,
                  e ->> 'ruta'             AS ruta,
                  e ->> 'descripcion'      AS descripcion,
                  e ->> 'idpadre'          AS idpadre,
                  e ->> 'leaf'             AS leaf,
                  e ->> 'compartimentacion' AS compartimentacion,
                  e ->> 'obligatorio'      AS obligatorio,
                  e ->> 'depth'            AS depth,
                  e ->> 'index'            AS index
                FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e
                $where ORDER BY idpadre, index;";
        return self::executeQuery($query);
    }

    public function getAllElements()
    {
        $query
            = "SELECT e ->> 'idelemento' AS idelemento,
                  e ->> 'denominacion'     AS denominacion,
                  e ->> 'tipo'             AS tipo,
                  e ->> 'humanlabel'       AS humanlabel,
                  e ->> 'namecomponent'    AS namecomponent,
                  e ->> 'mextype'          AS mextype,
                  e ->> 'cfg'              AS cfg,
                  e ->> 'event'            AS event,
                  e ->> 'fuente'           AS fuente,
                  e ->> 'model'            AS model,
                  e ->> 'ruta'             AS ruta,
                  e ->> 'descripcion'      AS descripcion,
                  e ->> 'idpadre'          AS idpadre,
                  e ->> 'leaf'             AS leaf,
                  e ->> 'compartimentacion' AS compartimentacion,
                  e ->> 'obligatorio'      AS obligatorio,
                  e ->> 'depth'            AS depth,
                  e ->> 'index'            AS index
                FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e
                ORDER BY idpadre, idelemento, index;";
        return self::executeQuery($query);
    }

    /**
     * @param $query
     *
     * @return array
     * @throws Doctrine_Connection_Exception
     */
    private function executeQuery($query)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();

            return $conexionActual->fetchAll($query);
        } catch (Exception $e) {
            throw $e;
            return array('success' => false);
        }
    }

    private function createCondition($filter = '')
    {
        $where = [];
        if ($filter) {
            $where[] = "(e ->> 'denominacion' ILIKE '%" . $filter . "%' OR e ->> 'leaf' = 'false')";
        }
        return $where;
    }

}
