<?php

/**
 * @package ERP-Com&uacute;n
 * @category Controller
 * @author Ing. Lisvany Alonso Martinez
 * @copyright (c) 2016, XETID
 */
class OrganosController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    /**
     * Lista los &oacute;rganos internos de una entidad
     */
    public function listarOrganosInternosAction(){
        $request = $this->_request->getPost();

        try {
            $idominio = $this->global->perfil->iddominio;
            $idestructura = $this->global->Estructura->idestructura;
            $filtro = $request['text'];
            $start = $request['start'];
            $limit = $request['limit'];
            $result = $this->integrator->metadatos->ObtenerEstructurasNoFormales(
                $idominio, $idestructura, $filtro, $limit, $start
            );
            $count = count(
                $this->integrator->metadatos->ObtenerEstructurasNoFormales($idominio, $idestructura, $filtro)
            );
            echo(json_encode(array('data' => $result, 'count' => $count)));
        } catch (Exception $e) {
            throw $e;
        }
    }

}

?>
