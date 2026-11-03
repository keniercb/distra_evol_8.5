<?php

class ReporteenmarcamientoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }


    public function listarComportamientos($params)
    {
        $datos = DatEnmarcamiento::getReporteComportamientos($params);
        return $datos;
    }

    public function listarPlanes($params)
    {
        $datos = DatEnmarcamientoplan::getReportePlanes($params);
        return $datos;
    }

    public function listarViaAdq($params)
    {
        $datos = DatEnmarcamientoViaAdq::getReporteViaAdq($params);
        return $datos;
    }

    public function exportarOD($params)
    {
        $datos = DatEnmarcamiento::getReporteComportamientos($params);
    
        header("Pragma: public");
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=OD.xls");
        header("Content-Transfer-Encoding: binary ");
        echo "  
            <th align=left>Resumen de enmarcamiento por centros de balance</th>
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Entidad Padre</th>
             <th align=left>Entidad</th>
             <th align=left>Centro de Balance</th>
             <th align=left>Enmarcamiento Plan</th>
             <th align=left>Enmarcamiento Real</th>
             <th align=left>Diferencia</th>
             <th align=left>Vía de adquisición</th>
             <th align=left>Enmarcamiento Plan Vía</th>
             <th align=left>Enmarcamiento Real Vía</th>
             <th align=left>Diferencia Vía</th>
        </tr>";
        foreach ($datos['data'] as $value) {
            echo "<tr> 
             <td align=left>" . $value['denominacionentidadpadre'] . "</td>
             <td align=left>" . $value['denominacionentidad'] . "</td>
             <td align=left>" . $value['denominacioncb'] . "</td>
             <td align=right >" . number_format($value['enmarcamientoplan'], 3) . "</td>
             <td align=right >" . number_format($value['enmarcamientoreal'], 3) . "</td>
             <td align=right >" . number_format($value['diferencia'], 3) . "</td>
             <td align=left>" . $value['denominacionvia'] . "</td>
             <td align=right >" . number_format($value['enmarcamientoplanv'], 3) . "</td>
             <td align=right >" . number_format($value['enmarcamientorealv'], 3) . "</td>
             <td align=right >" . number_format($value['diferenciav'], 3) . "</td>
             </tr>";
        }
        echo " <tr >
             <th align=left> Total </th>
             <th align=right > </th> 
             <th align=right ></th> 
             <th align=right >" . $datos['totalplan'] . "</th> 
	     <th align=right >" . $datos['totalreal'] . "</th>
             <th align=right >" . $datos['totaldiferencia'] . "</th>
             <th align=right ></th> 
             <th align=right >" . $datos['totalplanv'] . "</th> 
	     <th align=right >" . $datos['totalrealv'] . "</th>
             <th align=right >" . $datos['totaldiferenciav'] . "</th>
              </tr>";
        echo "</table>";
    }

    public function exportarenmarcplan($params)
    {
        $datos = DatEnmarcamientoplan::getReportePlanes($params);
        header("Pragma: public");
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=OD.xls");
        header("Content-Transfer-Encoding: binary ");
        echo "  
            <th align=left>Resumen de Enmarcamiento Por Plan" . $params['denominacionentidad'] . "</th>
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Entidad Padre</th>
             <th align=left>Entidad</th>
             <th align=left>Plan</th>
             <th align=left>Enmarcamiento Plan</th>
             <th align=left>Enmarcamiento Real</th>
             <th align=left>Diferencia</th>
        </tr>";
        $enmarcamientoplan = 0;
        $enmarcamientoreal = 0;
        $diferencia = 0;
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        foreach ($datos['data'] as $value) {
            echo "<tr> 
             <td align=left>" . $value['denominacionentidadpadre'] . "</td>
             <td align=left>" . $value['denominacionentidad'] . "</td>
             <td align=left>" . $value['denominacionplan'] . "</td>
             <td align=left>" . number_format($value['enmarcamientoplan'], 3) . "</td>
             <td align=right >" . number_format($value['enmarcamientoreal'], 3) . "</td>
             <td align=right >" . number_format($value['diferencia'], 3) . "</td>
             </tr>";
            if ($value['idpadre'] == $identrectora[0]['identidad']) {
                $enmarcamientoplan += $value['enmarcamientoplan'];
                $enmarcamientoreal += $value['enmarcamientoreal'];
                $diferencia += $value['diferencia'];
            }
        }
        echo " <tr >
             <th align=left> Total </th>
             <th align=right ></th> 
             <th align=right ></th> 
             <th align=right >" . number_format($enmarcamientoplan, 3) . "</th> 
	         <th align=right >" . number_format($enmarcamientoreal, 3) . "</th>
             <th align=right >" . number_format($diferencia, 3) . "</th>
             </tr>";
        echo "</table>";
    }

    public function exportarViaAdq($params)
    {
        $datos = DatEnmarcamientoViaAdq::getReporteViaAdq($params);
        header("Pragma: public");
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=OD.xls");
        header("Content-Transfer-Encoding: binary ");
        echo "  
            <th align=left>Resumen de Enmarcamiento Por Via de adquisicion</th>
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Entidad Padre</th>
             <th align=left>Entidad</th>
             <th align=left>Via de adquisicion</th>
             <th align=left>Enmarcamiento Plan</th>
             <th align=left>Enmarcamiento Real</th>
             <th align=left>Diferencia</th>
            
        </tr>";
        $enmarcamientoplan = 0;
        $enmarcamientoreal = 0;
        $diferencia = 0;
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        foreach ($datos['data'] as $value) {
            echo "<tr> 
             <td align=left>" . $value['denominacionentidadpadre'] . "</td>
             <td align=left>" . $value['denominacionentidad'] . "</td>
             <td align=left>" . $value['denominacionviaadquisicion'] . "</td>
             <td align=left>" . number_format($value['enmarcamientoplan'], 3) . "</td>
             <td align=right >" . number_format($value['enmarcamientoreal'], 3) . "</td>
             <td align=right >" . number_format($value['diferencia'], 3) . "</td>
             </tr>";
            if ($value['idpadre'] == $identrectora[0]['identidad']) {
                $enmarcamientoplan += $value['enmarcamientoplan'];
                $enmarcamientoreal += $value['enmarcamientoreal'];
                $diferencia += $value['diferencia'];
            }
        }
        echo " <tr >
             <th align=left> Total </th>
             <th align=right ></th> 
                 <th align=right ></th> 
             <th align=right >" . number_format($enmarcamientoplan, 3) . "</th> 
	      <th align=right >" . number_format($enmarcamientoreal, 3) . "</th>
                  <th align=right >" . number_format($diferencia, 3) . "</th>
              </tr>";
        echo "</table>";
    }

}

