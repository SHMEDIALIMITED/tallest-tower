define(
		['signal'], 

		function(Signal){

			return {
				gameSelected : new Signal(),
				showPopup : new Signal(),
				popupAction : new Signal(),
				saveGame: new Signal()
			} 
	
});