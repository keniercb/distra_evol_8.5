<?php

class NomgeneralesProxyService extends ZendExt_Model {

    /**
     * Servicio que implementa el retornpo de js de los nomencladores generales
     *
     * @author Lester A. Glez
     * @return direccion de un js
     * */
    public function mostrarNomencladoresGenerales() {
        $js = '';
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps
                . '/configuracion/nomgenerales/views/scripts/nomencladoresgenerales/nomencladoresgeneralesSevice.phtml';
        $js = file_get_contents($dir_phtml);

        return $js;
    }

    /**
     *  Retorna la dir del .js del combo-tree de naturaleza, para ser incluido en una página html
     *
     * @author: Jorge Luis Cuellar Mondeja
     * @date: 27/07/2013
     * @return dirección de un js
     */
    public function getJSNomNaturaleza() {
        return '
        <script type="text/javascript" src="/configuracion/nomgenerales/views/js/nomencladoresgenerales/comboTreeNaturaleza.component.js"></script>';
    }

    /**
     * Función para cargar las naturalezas
     * Jorge Luis Cuellar Mondeja
      /* 27/07/2013
     *
     * @param array $post parametros capturados desde el componente visual
     * (combo-árbol) ha través de POST
     *
     * @return array
     */
    public function getDatosArbolNaturaleza($post) {
        return NomNaturaleza::getNaturalezaPorIdPadre($post);
    }

    /**
     * Función para devolver las naturalezas
     * Lester A Glez
      /* 29/07/2013
     *
     * @param Doctrine Query $query parametros capturados desde el componente visual
     *
     * @return array
     */
    public function getNaturalezas($query) {
        $objNaturaleza = new NomNaturaleza();
        return $objNaturaleza->getNaturalezas($query);
    }

    /**
     *  Retorna la dir del .js del combo-tree de marca-modelo, para ser incluido en una página html
     *
     * @author: Jorge Luis Cuellar Mondeja
     * @date: 27/07/2013
     * @return dirección de un js
     */
    public function getJSNomMarcaModelo() {
        return '
        <script type="text/javascript" src="/configuracion/nomgenerales/views/js/nomencladoresgenerales/comboTreeMarcaModelo.component.js"></script>';
    }

    /**
     * Función para cargar las marcas-modelos
     * Jorge Luis Cuellar Mondeja
      /* 27/07/2013
     *
     * @param array $post parametros capturados desde el componente visual
     * (combo-árbol) ha través de POST
     *
     * @return array
     */
    public function getDatosArbolMarcaModelo($post) {
        $datos = MarcamodeloModel::GetMarcaModeloPorIdPadre($post);
        echo json_encode($datos);
    }

    public function InnerJoinNomNaturaleza($query, $alias, $aliasExterno, $select = false) {
        if ($select) {
            $query->addSelect("$aliasExterno.idnaturaleza,$aliasExterno.denominacion,$aliasExterno.naturalezalote as naturalezalote");
        }

        return $query->leftJoin("$alias.NomNaturaleza $aliasExterno");
    }

    /**
     *  Para servicio de configuración (campos configurables por tipos de medios)
     *
     * @param offset numeric Inicio de bloque de datos a consultar. Por default 0
     * @param limit  numeric Fin de bloque de datos a consultar. Por default 20
     *
     * @return array Naturalezas asociadas a los indicadores clasificados como medios en almacen o en explotación
     */
    public function getNaturalezasAsociadas($offset, $limit, $where) {
        return NomIndicador::getNaturalezasAsociadas($offset, $limit, $where);
    }

    public function devolverQueryNomNaturalezaRoot($query, $alias = 'n') {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        return NomNaturaleza::getQueryAsRootTable($query, $alias);
    }

    /**
     * Función para cargar las marcas
     * $parametros parametros para filtrar el resultado
     * return array
     */
    public function getMarcas($parametros) {
        return MarcamodeloModel::GetMarcas($parametros);
    }

    /**
     * Función para cargar los modelos
     * $parametros parametros para filtrar el resultado
     * return array
     */
    public function getModelos($parametros) {
        return MarcamodeloModel::GetModelos($parametros);
    }

    public function ObtenerCombustible() {

        $resCombustible = NomTipocombustible::ObtenerCombustible();

        return array('total_filas' => count($resCombustible), 'datos' => $resCombustible);
    }
    
    public function getNaturalezasAsociadasIndicadores($start = false, $limit = false, $filtro = false,$parametro){
        $objNaturaleza = new NomNaturaleza();
        return $objNaturaleza->getNaturalezasAsociadasIndicadores($start, $limit, $filtro,$parametro);
    }

}
