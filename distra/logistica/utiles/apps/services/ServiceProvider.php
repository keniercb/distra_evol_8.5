<?php

class ServiceProvider
{

    private $_sqlConnection;

    public function __construct()
    {
        $this->_sqlConnection = Doctrine_Manager::connection();
    }

    public function getMessage($stdClass)
    {
        if (method_exists($this, $stdClass->method)) {
            try {
                $response = call_user_func_array(array($this, $stdClass->method), $stdClass->params);
                return $this->jsonResponse($response);
            } catch (Exception $e) {
                return $this->jsonResponse('Ha ocurrido un error procesando la respuesta.');
            }
        }
        return $this->jsonResponse('El m&eacute;todo solicitado no existe.');
    }

    /**
     * @param $data
     * @return false|string
     *
     */
    private function jsonResponse($data)
    {
        return json_encode($data);
    }

    public function getCentrosCosto($buscar){
        $_sqlQuery = " select q.id, q.codigocentro, q.denomcentro from (
            select nc.concat as codigocentro, 
                   (case when  ncp.idcentrogrupo is null then nc.descripcioncentrogrupo else ncp.descripcioncentrogrupo end) as denomcentro,
                   nc.idcentrogrupo as id
            from mod_contabilidadcosto.nom_centrocosto nc
            left join mod_contabilidadcosto.nom_centrocosto ncp on nc.idpadre = ncp.idcentrogrupo
            where abs(nc.ordender - nc.ordenizq) = 1
            order by nc.concat
        ) q where (case when {$buscar} is not  null then (q.codigocentro ilike concat({$buscar}, '%') or q.denomcentro ilike concat({$buscar},'%')) else 1 = 1 end)";
        return array(
            'cantidad' => 0,
            'datos' => $this->_sqlConnection->execute($_sqlQuery)->fetchAll(PDO::FETCH_ASSOC)
        );
    }

}
