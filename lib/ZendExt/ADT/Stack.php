<?php
	class ZendExt_ADT_Stack 
	{
		private $count;
		private $top;

	    public function ZendExt_ADT_Stack()
	    {}

	    
	    public function Push($date)
	    {
	     	if ($this->count == 0)
	     	$this->top = new Zend_ADT_Node($date);
			else 
			{
				$temp = $this->top;
				$this->top = new Zend_ADT_Node($date);
				$this->top->next = $this->temp;
			}
			
			$this->count ++;
		}
		
	    	
		public function Pop()
		{
			if ($this->count > 0)
			{
		    	if ($this->count == 1)
		    	{
			    	$temp = $this->top;
			 		$this->top = null; 
			    	return $this->temp;
			    }
			    else
			    {
			    	$temp = $this->top->next;
			    	$end  = $this->top;
			    	$this->top = $this->temp;
			    	return $end;
			    	
			    }
			    
			    $this->count --;
			    		   
			}
    	}
    	
    	public function Top()
    	{
    	 if ($this->count > 0)
    	 return  $this->top;   		
    	}
    	
    	public function IsEmpty()
    	{
    		return ($this->count == 0);
    	}

    	public function Count()
    	{
    		return $this->count;    		
    	}
	    	
	   
		
	}
