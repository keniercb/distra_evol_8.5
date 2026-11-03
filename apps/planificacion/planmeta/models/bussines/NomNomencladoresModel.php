<?php

class NomNomencladoresModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar($nom) {
        return $nom->save();
    }

    public function Eliminar($nom) {
        if ($nom->delete()) {
            return true;
        }
        return false;
    }

    public function getXMLNomencladores() {
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

    public function getNomById($id) {
        $noms = NomNomencladoresModel::getXMLNomencladores();

        return $noms[$id - 1];
    }

    public function getConAlias($parametros, $domain, $alias) {
        $query = new Doctrine_Query();
        $query->from($domain . " n");
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                                "upper(n.denominacion) LIKE '%" . strtoupper($s)
                                . "%'"
                        );
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere(
                                    "upper(n.descripcion) LIKE '%" . strtoupper($s)
                                    . "%'"
                            );
                        }
                    }
                }
            }
        }
        return $query->select(
                                'n.' . $alias . " as id,n.denominacion,n.descripcion"
                        )
                        ->orderBy('n.denominacion,n.descripcion')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function validarDenominacion($node, $denominacion, $id = -1) {
        $nom = NomNomencladoresModel::getNomById($node);
        $query = new Doctrine_Query();
        $result = $query->select('m.' . $nom['alias'])
                ->from($nom['domain'] . " m")
                ->where(
                        'm.denominacion =? and m.idClasifmodelo <> ?', array($denominacion, $id)
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute(); //getSqlQuery();
        return $result;
    }

    public function exportarAExcel($params) {
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=nom_nomenclador.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo '<caption> Datos del nomenclador: ' . $params['dennomenclador'] . ' </caption>';
        echo "<tr >
          <table border=1 cellspacing=0 width=60%>
          <th align=left>Denominación</th>
          <th align=left>Descripción</th>
          </tr>";

        $datos = NomDatosnomenclador::getDatosNomPorIdTipoNom($params['idtiponomenclador']);
        foreach ($datos as $value) {
            if ($value['denominacionnom'] != '-' && $value['descripcion'] != '-') {
                echo "<tr> 
             <td align=left>" . $value['denominacionnom'] . "</td>
             <td align=left>" . $value['descripcion'] . "</td>
             </tr>";
            }
        }

        echo "</table>\n";
        echo '</BODY></HTML>';
    }

}
