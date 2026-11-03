<?php
class ReportesPuntualizacionAbel extends ZendExt_Model
{
    public function Tabla($datos) {
        $tabla="";
        //print_r($datos); die;
        switch ($datos->versionadoSelecionado) {
            case 21://Modelo No.V-1 (Puntualizaciones)
                $tabla=$this->PuntualizacionesV1($datos);
                break;
            case 22://Modelo No.V-2 (Puntualizaciones)(Telefonema)
                $tabla=$this->PuntualizacionesV2($datos);
                break;
            case 23://Modelo No.VIII-3
                $tabla=$this->PuntualizacionesV3($datos);
                break;
        }
        return $tabla;
        
    }
    
    public function TablaCaracterizacion($datos) {
        $tabla="";
        //print_r($datos); die;
        switch ($datos->versionadoSelecionado) {
            case 26://Modelo No.VIIi-1 (Puntualizaciones)
                $tabla=$this->CaracterizacionesV1($datos);
                break;
            case 27://Modelo No.VIII-2 (Puntualizaciones)(Telefonema)
                $tabla=$this->CaracterizacionesV2($datos);
                break;
            case 28://Modelo No.VIII-3
                $tabla=$this->CaracterizacionesV3($datos);
                break;
        }
        return $tabla;
        
    }
    
    public function PuntualizacionesV1($datos){
        $tabla="<HTML>
            <BODY>
            <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=222 COLSPAN=3 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Modelo No.V-1 (Puntualizaciones)</B></FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=187 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Cargo:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Grado:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=125 COLSPAN=2 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>APROBADO:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=187 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>NOMBRE Y APELLIDOS:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=380 COLSPAN=6 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>PUNTUALIZACIÓN DEL PLAN DE TRABAJO DE ____________</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 bgcolor=#F2F2F2 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>No.</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDAD (HORA Y LUGAR)</B></FONT></TD>
            <TD width=98 bgcolor=#F2F2F2 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA PLANIFICADA</B></FONT></TD>
            <TD width=96 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA (HORA) PUNTUALIZADA</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>DIRIGE</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>PARTICIPANTES</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=96 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>CARGO:</B></FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>GRADO:</B></FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=98 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>NOMBRE Y APELLIDOS:</B></FONT></TD>
            <TD width=33 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            </TABLE>
            </BODY>
            </HTML>
            ";
        return $tabla;
    }    
    public function PuntualizacionesV2($datos){
        $tabla = "<HTML>
            <BODY>
            <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=490 COLSPAN=4 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Modelo No.V-2 (Puntualizaciones)</B></FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=627 COLSPAN=6 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>TELEFONEMA</B></FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>Texto:</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 bgcolor=#F2F2F2 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>No.</B></FONT></TD>
            <TD width=363 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDAD (HORA Y LUGAR)</B></FONT></TD>
            <TD width=128 bgcolor=#F2F2F2 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA PLANIFICADA</B></FONT></TD>
            <TD width=136 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA (HORA) PUNTUALIZADA</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
            <TD width=363 ROWSPAN=4 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 ROWSPAN=4 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=136 ROWSPAN=4 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=363 ROWSPAN=4 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=136 ROWSPAN=4 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=363 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=136 COLSPAN=2 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=363 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=136 COLSPAN=2 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>CARGO:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>GRADO:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>NOMBRE Y APELLIDOS:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=238 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=363 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>LISTA DE DESTINARIOS:</B></FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=363 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>1-</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=363 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>2-</FONT></TD>
            <TD width=128 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=74 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            </TABLE>
            </BODY>
            </HTML>
            ";
        return $tabla;
    }    
    public function PuntualizacionesV3($datos){
        $tabla="<HTML>
            <BODY>
            <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Modelo No.V-1 (Puntualizaciones)</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=374 COLSPAN=6 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>PUNTUALIZACIÓN DEL PLAN DE TRABAJO DE ____________</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=374 COLSPAN=6 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>PARA EL MES DE ____________________</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 bgcolor=#F2F2F2 ROWSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>No.</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDAD (HORA Y LUGAR)</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>MES</FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>DIRIGE</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>PARTICIPANTES</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 bgcolor=#F2F2F2 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA PLANIFICADA</B></FONT></TD>
            <TD width=125 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA (HORA) PUNTUALIZADA</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=811 COLSPAN=13 align=left><FONT face=Calibri size=2 color=#000000>III. FUNCIONAMIENTO Y CONTROL DEL GOBIERNO</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>2</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=811 COLSPAN=13 align=left><FONT face=Calibri size=2 color=#000000>VI. DEFENSA, ORDEN INTERIOR Y DEFENSA CIVIL</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=811 COLSPAN=13 align=left><FONT face=Calibri size=2 color=#000000>CONSEJO DE DEFENSA NACIONAL</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>2</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=811 COLSPAN=13 align=left><FONT face=Calibri size=2 color=#000000>MINISTERIO DE LAS FUERZAS ARMADAS REVOLUCIONARIAS</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>2</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=811 COLSPAN=13 align=left><FONT face=Calibri size=2 color=#000000>ESTADO MAYOR NACIONAL DE LA DEFENSA CIVIL</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=right><FONT face=Calibri size=2 color=#000000>2</FONT></TD>
            <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>CARGO:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>GRADO:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>NOMBRE Y APELLIDOS:</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            </TABLE>
            </BODY>
            </HTML>
            ";
        
        return $tabla;
    }
    
    public function CaracterizacionesV1($datos){
        $tabla="<HTML>
                <BODY>
                <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
                <TR>
                <TD width=78 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=49 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=289 COLSPAN=4 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Modelo No.VII-1 (Caracterizacion del plan)</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=49 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=101 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=49 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=289 COLSPAN=4 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>CARACTERIZACIÓN DEL PLAN ____________</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=49 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=101 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=174 COLSPAN=3 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>DESDE: ____________</B></FONT></TD>
                <TD width=101 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>HASTA: _____________</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=49 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=101 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 bgcolor=#F2F2F2 ROWSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>CAPÍTULOS</B></FONT></TD>
                <TD width=400 bgcolor=#F2F2F2 COLSPAN=6 align=center><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT></TD>
                <TD width=374 bgcolor=#F2F2F2 COLSPAN=6 align=center><FONT face=Calibri size=2 color=#000000><B>EXTERNAS</B></FONT></TD>
                <TD width=374 bgcolor=#F2F2F2 COLSPAN=6 align=center><FONT face=Calibri size=2 color=#000000><B>PROPIAS</B></FONT></TD>
                </TR>
                <TR>
                <TD width=174 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT></TD>
                <TD width=226 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT></TD>
                </TR>
                <TR>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>I</FONT></TD>
                <TD width=174 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>II</FONT></TD>
                <TD width=174 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>III</FONT></TD>
                <TD width=174 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>IV</FONT></TD>
                <TD width=174 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>V</FONT></TD>
                <TD width=174 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>VI</FONT></TD>
                <TD width=174 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=78 align=center><FONT face=Calibri size=2 color=#000000>TOTAL</FONT></TD>
                <TD width=174 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=226 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=478 COLSPAN=7 align=center><FONT face=Calibri size=2 color=#000000>% DEL TOTAL</FONT></TD>
                <TD width=374 COLSPAN=6 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=374 COLSPAN=6 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                </TABLE>
                </BODY>
                </HTML>";
        
        return $tabla;
    }    
    public function CaracterizacionesV2($datos){
        $tabla="<HTML>
                <BODY>
                <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
                <TR>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=624 COLSPAN=10 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Modelo No.VII-2 (Resumen de cumplimiento del plan)</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=562 COLSPAN=9 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>RESUMEN DEL CUMPLIMIENTO DEL PLAN DE TRABAJO MENSUAL (INDIVIDUAL)</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=998 COLSPAN=16 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>DE ______________________________________________________________________________________DEL MES DE __________________________</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=437 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=7 align=center><FONT face=Calibri size=2 color=#000000><B>TOTAL DE TAREAS PLANIFICADAS</B></FONT></TD>
                <TD width=374 bgcolor=#F2F2F2 COLSPAN=6 align=center><FONT face=Calibri size=2 color=#000000><B>DE ELLAS</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>PROPUESTAS SUSPENDIDAS</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>NUEVAS TAREAS (EXTRA PLANES)</B></FONT></TD>
                </TR>
                <TR>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT></TD>
                <TD width=187 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT></TD>
                </TR>
                <TR>
                </TR>
                <TR>
                <TD width=437 COLSPAN=7 align=left><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=437 COLSPAN=7 align=left><FONT face=Calibri size=2 color=#000000>2</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=1186 COLSPAN=19 align=left><FONT face=Calibri size=2 color=#000000>De ellas externas/</FONT></TD>
                </TR>
                <TR>
                <TD width=437 COLSPAN=7 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=437 COLSPAN=7 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=187 COLSPAN=3 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                </TR>
                <TR>
                <TD width=1186 COLSPAN=19 align=left><FONT face=Calibri size=2 color=#000000><B>ANÁLISIS CUALITATIVO</B></FONT></TD>
                </TR>
                <TR>
                <TD width=1186 ROWSPAN=5 COLSPAN=19 align=left><FONT face=Calibri size=2 color=#000000>Se realiza un resumen cualitativo de las principales actividades cumplidas destacando las deficiencias, causas de las incumplidas, suspendidas , pospuestas propias y extraplanes</FONT></TD>
                </TR>
                <TR>
                </TR>
                <TR>
                </TR>
                <TR>
                </TR>
                <TR>
                </TR>
                <TR>
                </TABLE>
                </BODY>
                </HTML>";
        
        return $tabla;
    }    
    public function CaracterizacionesV3($datos){
        $tabla="<HTML>
            <BODY>
            <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=624 COLSPAN=10 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>Modelo No.VII-3 (Resumen de puntualizaciones del plan)</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=562 COLSPAN=9 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>RESUMEN DEL PUNTUALIZACIONES DEL PLAN</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=998 COLSPAN=16 align=center style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>DE ________________________________________________________________________________DEL MES DE __________________________</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000><B>&nbsp;</B></FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=62 align=left style='border-style: none;'><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=250 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>TOTAL DE TAREAS PLANIFICADAS</B></FONT></TD>
            <TD width=250 bgcolor=#F2F2F2 COLSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>DE ELLAS</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>NUEVAS TAREAS (EXTRA PLANES)</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>MODIFICADAS</B></FONT></TD>
            <TD width=125 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>POSPUESTAS</B></FONT></TD>
            <TD width=187 bgcolor=#F2F2F2 ROWSPAN=3 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>SUSPENDIDAS</B></FONT></TD>
            </TR>
            <TR>
            <TD width=125 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT></TD>
            <TD width=125 bgcolor=#F2F2F2 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT></TD>
            </TR>
            <TR>
            </TR>
            <TR>
            <TD width=250 COLSPAN=4 align=left><FONT face=Calibri size=2 color=#000000>1</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=250 COLSPAN=4 align=left><FONT face=Calibri size=2 color=#000000>2</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=1186 COLSPAN=19 align=left><FONT face=Calibri size=2 color=#000000>De ellas externas/</FONT></TD>
            </TR>
            <TR>
            <TD width=250 COLSPAN=4 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=250 COLSPAN=4 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=125 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=187 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            </TABLE>
            </BODY>
            </HTML>";
        
        return $tabla;
    }
    
}

/**
 *  SELECT
  plan.denelemento as denomacti,
  act.idactividad,
  act.fechainicio,
  act.fechafin,
  act.horainicio,
  act.horafin,   
  act.lugar,
  plan.dirigente,
  plan.participante, 
  planpuntualizada.denelemento as puntualizcion,
  actpuntualizada.fechainicio as fechainiciopuntualizacion,
  actpuntualizada.fechafin as fechafinpuntualizacion,
  actpuntualizada.horainicio as horainiciopuntualizacion,
  actpuntualizada.horafin as horafinpuntualizacion,
  actpuntualizada.lugar as lugarpuntualizacion,
  planpuntualizada.dirigente as dirigentepuntualizacion,
  planpuntualizada.participante as participantepuntualizacion,
(select array (SELECT
  mod_objetivos.dat_observaciones_pdo.cuerpo
FROM
  mod_objetivos.dat_observaciones_pdo
WHERE
  mod_objetivos.dat_observaciones_pdo.idelemento = act.idactividad)) as observaciones
  
  
FROM

  mod_objetivos.dat_elementos plan
  
   inner join mod_objetivos.dat_actividades act ON (plan.idelemento = act.idactividad)
   
   inner join mod_objetivos.dat_puntualizacion ap on (ap.idactividad = act.idactividad)  
   
   
   inner join mod_objetivos.dat_actividades actpuntualizada ON (actpuntualizada.idactividad = ap.idactividadpuntualizacion)
   
   inner join mod_objetivos.dat_elementos planpuntualizada on (planpuntualizada.idelemento = ap.idactividadpuntualizacion)
 * 
 */
