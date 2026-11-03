<?php


class NomNomencladoresModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();

    }

    public function Insertar($nom)
    {
        return $nom->save();
    }

    public function Eliminar($nom)
    {
        if ($nom->delete()) {
            return true;
        }
        return false;
    }

    public function getXMLNomencladores()
    {
        //Se almacena en $ident la dirección del xml de nomencladores que se carga
        $ident = $_SERVER['DOCUMENT_ROOT']
            . '/../apps/planificacion/comun/recursos/xml/nomencladores.xml'; //$_FILES['fileUpload']['name'];
        //  Se crea el objeto ya listo usando el componente ExpImp.
        $importador = new ZendExt_CompExImp_CompExImp;
        $objImportar = $importador->importar($ident, 'XML');

        foreach ($objImportar as $c) {
            for ($j = 0; $j < count($c); $j++) {
                $dat[] = $c[$j];
            }
        }

        /* $dat [] = array('id' => 1,'text' => "Clases de modelos",'leaf' => true,'domain'=>  'NomClasmodelo','alias'=>'idclasmodelo','add'=>true,'mod'=>true,'del'=>true);
          $dat [] = array('id' => 2,'text' => "Tipos de comentarios",'leaf' => true,'domain'=>  'NomTipocomentario','alias'=>'idtipocomentario','add'=>true,'mod'=>true,'del'=>true);
          $dat [] = array('id' => 3,'text' => "Tipos de documentos",'leaf' => true,'domain'=>  'NomTipodocumento','alias'=>'idtipodocumento','add'=>true,'mod'=>true,'del'=>false); */
        /* echo'<pre>';
          print_r($dat);die; */
        return $dat;
    }

    public function getNomById($id)
    {
        $noms = NomNomencladoresModel::getXMLNomencladores();

        return $noms[$id - 1];
    }

    public function getConAlias($parametros, $domain, $alias)
    {
        $query = new Doctrine_Query();
        $query->from($domain . " n");
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
                        }
                    }
                }
            }
        }
        return $query->select('n.' . $alias . " as id,n.denominacion,n.descripcion")
            ->orderBy('n.denominacion,n.descripcion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public function validarDenominacion($node, $denominacion, $id = -1)
    {
        $nom = NomNomencladoresModel::getNomById($node);
        $query = new Doctrine_Query();
        $result = $query->select('m.' . $nom['alias'])
            ->from($nom['domain'] . " m")
            ->where('m.denominacion =? and m.idClasifmodelo <> ?', array($denominacion, $id))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute(); //getSqlQuery();
        return $result;
    }

}
