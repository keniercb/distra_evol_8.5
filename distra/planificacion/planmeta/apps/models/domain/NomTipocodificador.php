<?php
class NomTipocodificador extends BaseNomTipocodificador
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listar($parametros)
    {

        $query = new Doctrine_Query();
        $queryTotal = new Doctrine_Query();
        $devolverPadre = ($parametros['idpadre'] == 0 ? "null as _parent"
            : "idtipocodificador as _parent");
        if ($parametros['limit'] != null && $parametros['start'] != null) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        if ($parametros['denominacion'] != null) {
            $query->addWhere(
                "upper(n.denominacion) LIKE '%" . strtoupper(
                    $parametros['denominacion']
                ) . "%'"
            );
            $queryTotal->addWhere(
                "upper(n.denominacion) LIKE '%" . strtoupper(
                    $parametros['denominacion']
                ) . "%'"
            );
        }
        if ($parametros['descripcion'] != null) {
            $query->addWhere(
                "upper(n.descripcion) LIKE '%" . strtoupper(
                    $parametros['descripcion']
                ) . "%'"
            );
            $queryTotal->addWhere(
                "upper(n.descripcion) LIKE '%" . strtoupper(
                    $parametros['descripcion']
                ) . "%'"
            );
        }
        //nota de edilio
        //este filtro no funciona pk no existe la columna "codigo" en BD y no se sabe kien la mando a kitar

        if ($parametros['codigo']) {
            $query->addWhere(
                'n.codigo LIKE ?', $parametros['codigo'] . "%"
            );
            $queryTotal->addWhere(
                'n.codigo LIKE ?', $parametros['codigo'] . "%"
            );
        }

        if ($parametros['idpadre'] == null || $parametros['idpadre'] == 0) {
            $data->data = $query
                ->select(
                    "n.idtipocodificador as id, n.denominacion,
                    n.descripcion, n.color, null as _parent,
                    false as _is_leaf, n.idformato"
                )
                ->from("NomTipocodificador n")
                ->orderby("n.denominacion, n.descripcion")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            $data->total = $queryTotal
                ->select("COUNT(n.idtipocodificador) as total")
                ->from("NomTipocodificador n")
                ->execute()->getFirst()->total;
        } else {
           /* if ($parametros['codigo']) {
                $query->addWhere(
                    'n.codigo LIKE ?', $parametros['codigo'] . "%"
                );
                $queryTotal->addWhere(
                    'n.codigo LIKE ?', $parametros['codigo'] . "%"
                );
            }*/
            $data->data = $query->select(
                "n.iddatoscodificador as id, n.denominacion, n.descripcion, n.color, "
                . $devolverPadre
                . ",true as _is_leaf, n.idumedida, n.codigo"
            )
                ->from("NomDatoscodificador n")
                ->orderby("n.codigo")
                ->addWhere('n.idtipocodificador=?', $parametros['idpadre'])
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            $data->total = $queryTotal->select(
                "COUNT(n.iddatoscodificador) as total"
            )
                ->from("NomDatoscodificador n")
                ->addWhere('n.idtipocodificador=?', $parametros['idpadre'])
                ->execute()->getFirst()->total;
        }
        return $data;
    }

    public function buscarpordenom($denominacion)
    {
        $query = new Doctrine_Query();
        return $query->select('n.denominacion')
            ->from('NomTipocodificador n')
            ->where('UPPER(n.denominacion) = ?', $denominacion)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public function listarTipoCodificadores()
    {
        $query = new Doctrine_Query();
        $data->data = $query
            ->from("NomTipocodificador n")
            ->orderby("n.denominacion, n.descripcion")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $data;
    }

    public function listarDatosCodifdadoIdPadre($params)
    {
        $query = new Doctrine_Query();
        $queryTotal = new Doctrine_Query();
        if ($params['codigo']) {
            $query->addWhere('n.codigo LIKE ?', $params['codigo'] . "%");
            $queryTotal->addWhere('n.codigo LIKE ?', $params['codigo']);
        }
        if ($params['denominacion']) {
            $query->addWhere(
                "upper(n.denominacion) LIKE '%" . strtoupper(
                    $params['denominacion']
                ) . "%'"
            );
            $queryTotal->addWhere(
                "upper(n.denominacion) LIKE '%" . strtoupper(
                    $params['denominacion']
                ) . "%'"
            );
        }
        if ($params['idumedida']) {
            $query->addWhere("n.idumedida =?", $params['idumedida']);
            $queryTotal->addWhere("n.idumedida =?", $params['idumedida']);
        }
        $data->data = $query->from("NomDatoscodificador n")
            ->orderby("n.denominacion, n.descripcion")
            ->addWhere('n.idtipocodificador = ?', $params['idpadre'])
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        $data->total = $queryTotal->select(
            "COUNT(DISTINCT n.iddatoscodificador) as total"
        )
            ->from("NomDatoscodificador n")
            ->addWhere('n.idtipocodificador = ?', $params['idpadre'])
            ->execute()->getFirst()->total;
        return $data;
    }

    public function TotaldeCodificadores($parametros)
    {
        $queryTotal = new Doctrine_Query();
        if ($parametros['idpadre'] == 0) {
            $data->total = $queryTotal->select(
                "COUNT(n.idtipocodificador) as total"
            )
                ->from("NomTipocodificador n")
                ->execute()->getFirst()->total;
        } else {
            $data->total = $queryTotal->select(
                "COUNT(n.iddatoscodificador) as total"
            )
                ->from("NomDatoscodificador n")
                ->addWhere('n.idtipocodificador=?', $parametros['idpadre'])
                ->execute()->getFirst()->total;
        }
        return $data;
    }

}
