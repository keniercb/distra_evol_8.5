<?php

class NomCategoriaprecioModel extends NomencladoresModel
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 
     * @param type $array
     */
    public function habilitarDesabiltarEntidad($array)
    {
        $resultado = parent::habilitarDesabiltarEntidad($array);
        if ($array['habilitarentidad'] == 1) {
            $categoria = $this->obtenerCategoriaPrecioAux($array);
            $tipoprecio = $this->obtenerTipoPrecioAux();
            $collection = new Doctrine_Collection('DatCuentadesgloceprecio');
            foreach ($categoria as $categ) {
                foreach ($tipoprecio as $precio) {
                    $desglose = new DatCuentadesgloceprecio();
                    $desglose->synchronizeWithArray(
                        [
                            'idtipoprecio' => $precio['idtipoprecio'],
                            'idcategoriaprecioentidad' => $categ['idcategoriaprecioentidad']
                        ]
                    );
                    $collection->add($desglose);
                }
            }
            $collection->save();
        }
        return $resultado;
    }

    public function obtenerCategoriaPrecioAux($params)
    {
        $arr = (!is_array($params['idnom'])) ? json_decode(
                stripslashes($params['idnom'])
            ) : $params['idnom'];
        $query = Doctrine_Query::create()
            ->select(
                'ncp.idcategoriaprecio as idcategoriaprecio, '
                . 'dcpe.idcategoriaprecioentidad as idcategoriaprecioentidad'
            )
            ->from('NomCategoriaprecio ncp')
            ->innerJoin('ncp.DatCategoriaprecioEntidad dcpe')
            ->where(
            'ncp.aplicartodos = ? '
            . 'and dcpe.idestructuracomun = ?', array(1, $this->global->Estructura->idestructura)
        );
        $query->whereIn('ncp.idcategoriaprecio', $arr);
        return $query->fetchArray();
    }

    public function obtenerTipoPrecioAux()
    {
        $tipoprecio = Doctrine_Query::create()
            ->select('idtipoprecio')
            ->from('DatTipoprecioEntidad')
            ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura))
            ->fetchArray();
        return $tipoprecio;
    }

    public function cargarCodigos() {
        $sql = "SELECT codigo FROM mod_logfacturacion.nom_codigocategoria";
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute($sql)
            ->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $q);
    }

}
