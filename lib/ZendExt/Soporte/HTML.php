<?php
class ZendExt_Soporte_HTML {
	private $html;
	public function __construct($fuente) {
		$this->html=$this->Leer_Plantilla($fuente);
	}
	function Leer_Plantilla($fuente){
		$texto=file($fuente);
		$todo="";
		$cant=sizeof($texto);
		for($i=0;$i<$cant;$i++)
		{
		$todo=$todo.$texto[$i];
		}
		return $todo;
	}
	public function Modificar_Planilla($equivalencias){
		$cuerpo = $this->html;
		$cant = sizeof($equivalencias[0]);
		for ($i=0;$i<$cant;$i++){	
			$cuerpo=str_replace($equivalencias[0][$i],$equivalencias[1][$i],$cuerpo);
		}
		$this->html=$cuerpo;
	} 
	public function Listar($coleccion,$delimitador){
		$cuerpo = $this->html;
		//---Preparar la salida
		$resultado = "";
		//---Dividir el cuerpo
		$a=strpos($cuerpo,$delimitador)+1;
		$b=strrpos($cuerpo,$delimitador);
		$cant=$b-$a;
		$rep=substr($cuerpo,$a,$cant);
		$matriz=explode($rep,$cuerpo);
		$antes = $matriz[0];
		$despues = $matriz[1];		
		//---Escribir Documento antes de Lista
		$cant = strlen($antes)-1;
		$antes = substr($antes,0,$cant);
		$resultado .= $antes;
		//---Escribir Lista
		$cant= sizeof($coleccion);
		for($i=1;$i<$cant;$i++){
			$aux = $rep;
			$cant1=sizeof($coleccion[$i]);
			for($j=0;$j<$cant1;$j++){
				$aux = str_replace($coleccion[0][$j],$coleccion[$i][$j],$aux);
			}
			$resultado .= $aux;
		}
		//---Escribir Documento des[ues de lista
		$cant = strlen($despues)-1;
		$despues = substr($despues,1,$cant);
		$resultado .= $despues;
		$this->html=$resultado;
	}
	public function Salvar($destino='sinnombre.pdf')
	{ 
    	include_once 'html2fpdf-3.0.2b/html2fpdf.php';
    	$aux = new HTML2FPDF();
    	$aux->Open();
    	$aux->UseCSS();
    	$aux->UsePRE();
    	$aux->UseTableHeader();
    	$aux->AddPage();
    	$aux->WriteHTML($this->html);
    	$aux->Close();
    	$aux->Output($destino,'F');
	}
	public function Gethtml()
	{
		return $this->html;
	}
	public function VistaPrevia()
	{
		echo $this->html;
	}
}
