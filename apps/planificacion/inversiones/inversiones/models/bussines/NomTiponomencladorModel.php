<?php

class NomTiponomencladorModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTiponomenclador $NomTiponomenclador)
    {
        $NomTiponomenclador->save();
    }

    public function Actualizar(NomTiponomenclador $NomTiponomenclador)
    {
        $NomTiponomenclador->save();
    }

    public function Eliminar($NomTiponomenclador)
    {
        try {
            $NomTiponomenclador->delete();
            return 1;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '23503') {
                return $e->getCode();
            }
        }
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
        return $dat;
    }

    public function listar($idtipocomponente)
    {
        /* Listar combo de nomencladores en el componente desglose
         * del modulo de Bases del plan. (2011)
         */

        $query = new Doctrine_Query();
        $result = $query
            ->select('dn.idtiponomenclador,dn.denominacion')
            ->from('NomTiponomenclador dn')
            // ->innerJoin('dn.DatTipocomponentetiponomenclador tctn WITH tctn.idtipocomponente = ? ', $idtipocomponente)
            ->execute()
            ->toArray(true);
        return $result;
    }

    public function listarNomCalculoNiveles($idEsp)
    {
        $query = new Doctrine_Query();
        return $query->select('n.idtiponomenclador,n.denominacion,dct.idconftiponomesp')
            ->from('NomTiponomenclador n')
            ->innerJoin('n.DatTipocomponentetiponomenclador tctn')
            ->innerJoin("tctn.NomTipocomponenteplanif c WITH upper(c.denominacion) = 'NIVELES'")
            ->innerJoin('n.DatConftiponomesp dct ')
            //->innerJoin('n.DatConftiponomesp dct WITH dct.idespecialidad = ' . $idEsp . '')
               // ->getSqlQuery();
       // print_r($query);die;
            ->execute()
            ->toArray(true);
        //->getSqlQuery(); print_r($result);die;
        //print_r($query);die;
    }
    
    

}

//fin clase
?>
